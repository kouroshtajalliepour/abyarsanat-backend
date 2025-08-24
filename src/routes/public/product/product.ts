export default (app:IApp) => {

    const {
        makeValidateString,
        makeValidateUrl,
        validateULID,
        validateDescription,
        makeValidateHTML,
        validateSlug,
        validateNumber
    } = useValidators()


    const {
        generateId,
        validateHTML: html
    } = useFrameworks()

    const validateString = makeValidateString()
    const validateUrl = makeValidateUrl(false)
    const validateHTML = makeValidateHTML(html)

    const visibleFields = [
        'id',
        'slug',
        "weight",
        'pid',
        'created_at',
        "product_category_id",
        'last_modified_at'
    ]
    const visibleLocalizedFields = [
        'name',
        "image_alt"
    ]

    return useRoutes(
        {
            app,
            middleware: [],
            options: {
                // collectView: true,
                collectLog: true,
                // useCaptcha: true,
            },
            db: {
                tableName: 'product',
                id: {
                    validator: validateULID,
                    dbName: 'id'
                },
                localizedFields: {
                    
                    name: {
                        validator:validateString,
                        filterType: "like"
                    },
                    description: {
                        validator:validateDescription,
                    },
                    content: {
                        validator: validateHTML
                    },
                    image_alt: {
                        validator:validateString,
                        filterType: "none"
                    },
                    price_based_on: {
                        validator:validateString,
                    },
                    
                },
                fields: {
                    // * not in field
                    id: {
                        validator: validateULID,
                        dbName: 'id',
                        allowedToBeNull: true,
                        filterType: "isNot"
                    },
                    slug: {
                        validator:validateSlug,
                        unique: true
                    },                  
                    pid: {
                        validator:validateSlug,
                        unique: true
                    },    
                    weight: {
                        validator:validateNumber,
                    }, 
                    x: {
                        validator:validateNumber,
                    }, 
                    y: {
                        validator:validateNumber,
                    }, 
                    z: {
                        validator:validateNumber,
                    }, 
                    has_multiple_types: {
                        type: "boolean"
                    }, 
                    published: {
                        type: "boolean",
                        allowedToBeNull: true
                    }, 
                    product_category_id: {
                        validator:validateULID,
                        unique: true
                    },                  
                    product_brand_id: {
                        validator:validateULID,
                        unique: true,
                        allowedToBeNull: true
                    },                  
                },
            },
            routes: {
                // todo extra filters space
                get: {
                    disabled: false,
                    options: {
                        maxRequests: 10,
                        defaultOrderBy: "(actual_query.available_amount > actual_query.frozen_amount_in_warehouse is false)",
                        extraFilters: " discounted_price is not null ",
                        relationalFilters: [
                            {
                                tableName: "product_model",
                                fields: {
                                    price: {
                                        type: "number",
                                        target: "discounted_price",
                                        filterType: "number",
                                        validator: validateNumber
                                    },
                                },
                                parentId: "id",
                                childId: "product_id",
                                // extraFilters: "product_model.index_number = 1"
                            },
                            {
                                tableName: "product_brand",
                                fields: {
                                    brands: {
                                        // type: "number",
                                        target: "serial_id",
                                        // filterType: "number",
                                        validator: validateNumber,
                                        allowedToBeArray: true,
                                    },
                                },
                                parentId: "product_brand_id",
                                childId: "id",
                                // extraFilters: "product_model.index_number = 1"
                            },
                            {
                                tableName: "product_filter",
                                fields: {
                                    filters: {
                                        secondField: "product_category_filter_serial_id",
                                        secondFieldValidator: validateNumber,
                                        filterType: "exists",
                                        allowedToBeArray: true,
                                        validator: validateNumber,
                                        constructor: (key: string) => {
                                            return key.startsWith('f-') ? key.slice(2) : key;
                                        },
                                        target: "product_category_filter_value_serial_id"
                                    },
                                },
                                parentId: "id",
                                childId: "product_id",
                            },
                        ],
                        additionalData: [
                            {
                                name: "info",
                                singular: true,
                                getQuery: ({data, locale}) => {
                                    return `
                                        SELECT
                                            *
                                        FROM
                                            info_localized_info
                                        WHERE
                                            id = '1' AND locale = '${locale}'
                                    `
                                }
                            },
                            {
                                name: "menu",
                                getQuery: ({data, locale}) => {
                                    return `
                                        SELECT
                                            pc.id,
                                            pc.slug,
                                            pc.homepage_index,
                                            max(pm.discounted_price) as max_price,
                                            pcl.name,
                                            COALESCE(
                                                json_agg(
                                                    CASE
                                                        WHEN c.id IS NULL THEN NULL
                                                        ELSE json_build_object('id', c.id, 'slug', c.slug, 'name', cl.name, 'max_price', pml.max_price, 'homepage_index', c.homepage_index)
                                                    END
                                                ) FILTER (WHERE c.id IS NOT NULL),
                                                '[]'::json
                                            ) AS sub_categories
                                        FROM
                                            product_category pc
                                        LEFT JOIN 
                                            product_category_localized_info pcl ON pcl.id = pc.id and pcl.locale = '${locale}'
                                        LEFT JOIN
                                            product_category c ON pc.id = c.parent_id
                                        LEFT JOIN 
                                            product_category_localized_info cl ON cl.id = c.id and cl.locale = '${locale}'
                                        LEFT JOIN 
                                            product_model pm ON  pm.product_category_id = pc.id and pm.discounted_price is not null and pm.discounted_price > 0
                                        LEFT JOIN 
                                            (
                                                SELECT pml.product_category_id, MAX(pml.discounted_price) as max_price
                                                FROM product_model pml
                                                WHERE pml.discounted_price is not null and pml.discounted_price > 0
                                                GROUP BY pml.product_category_id
                                            ) pml ON pc.id = pml.product_category_id
                                        WHERE
                                            pc.homepage_index IS NOT NULL AND pc.homepage_index <> 0 
                                        GROUP BY
                                            pc.id, pc.slug, pcl.name,pc.homepage_index
                                        ORDER BY
                                            pc.homepage_index ASC;
                                    `
                                }
                            },
                        ],
                        inheritanceFilter: {
                            fetchOriginOptions:{
                                active: true,
                                fetchUsing: "slug",
                                extraTables: [
                                    {
                                        displayName: "filters",
                                        tableName: "product_category_filter",
                                        parentId: "id",
                                        childId: "product_category_id",
                                        // passLocale: true,
                                        // localized: true,
                                        visibleFields: {
                                            singularRelations: [
                                                {
                                                    tableName: "product_category_filter_localized_info",
                                                    fields: [
                                                        "name",
                                                    ],
                                                    parentId: "id",
                                                    childId: "id"
                                                },
                                            ],
                                        },
                                        multiOptions: {
                                            orderBy: "index_number asc",
                                            limit: 20
                                        }
                                    },
                                    {
                                        displayName: "product_models",
                                        tableName: "product_model",
                                        parentId: "id",
                                        childId: "product_category_id",
                                        extraFilter: "discounted_price is not null and discounted_price > 0",
                                        visibleFields: {
                                            basic: [
                                                "max(discounted_price) as max_price",
                                            ],
                                        },
                                    },
                                    {
                                        displayName: "product_brands",
                                        tableName: "product_category_brand",
                                        parentId: "id",
                                        childId: "product_category_id",
                                        visibleFields: {
                                            singularRelations: [
                                                {
                                                    tableName: "product_brand",
                                                    fields: [
                                                        "serial_id",
                                                    ],
                                                    parentId: "product_brand_id",
                                                    childId: "id"
                                                },
                                                {
                                                    tableName: "product_brand_localized_info",
                                                    fields: [
                                                        "name",
                                                    ],
                                                    parentId: "product_brand_id",
                                                    childId: "id"
                                                },
                                            ],
                                        },
                                        multiOptions: {
                                            orderBy: "index_number asc",
                                            limit: 20
                                        }
                                    },
                                    {
                                        displayName: "filter_values",
                                        tableName: "product_category_filter_value",
                                        parentId: "id",
                                        childId: "product_category_id",
                                        // passLocale: true,
                                        // localized: true,
                                        visibleFields: {
                                            singularRelations: [
                                                {
                                                    tableName: "product_category_filter_value_localized_info",
                                                    fields: [
                                                        "name",
                                                    ],
                                                    parentId: "id",
                                                    childId: "id",
                                                },
                                            ],
                                        },
                                        multiOptions: {
                                            orderBy: "index_number asc",
                                            limit: 400
                                        }
                                    },
                                    {
                                        displayName: "sub_categories",
                                        tableName: "product_category",
                                        parentId: "id",
                                        childId: "parent_id",
                                        // passLocale: true,
                                        // localized: true,
                                        visibleFields: {
                                            singularRelations: [
                                                {
                                                    tableName: "product_category_localized_info",
                                                    fields: [
                                                        "name",
                                                    ],
                                                    parentId: "id",
                                                    childId: "id",
                                                },
                                            ],
                                            multiRelations: [
                                                {
                                                    tableName: "product_model",
                                                    fields: [
                                                        "max(discounted_price) as max_price",
                                                    ],
                                                    extraFilters: "t.discounted_price is not null and t.discounted_price > 0",
                                                    parentId: "id",
                                                    childId: "product_category_id",
                                                },
                                            ]
                                        },
                                        
                                        multiOptions: {
                                            orderBy: "created_at desc",
                                            limit: 20
                                        }
                                    },
                                ],
                                inheritance: {
                                    tableName: 'product_category',
                                    visibleFields: {
                                        localized: [
                                            {
                                                key: 'name',
                                                name: 'name',
                                                parentKey: "name",
                                            },
                                            {
                                                key: 'seo_title',
                                                name: 'seo_title',
                                                parentKey: "seo_title",
                                            },
                                        ],
                                        basic: [
                                            {
                                                key: 'slug',
                                                name: 'slug',
                                                parentKey: "slug",
                                            }
                                        ],
                                    }
                                },
                                localize: true
                            },
                            tableName: "product_category",
                            parentId: "product_category_id",
                            // grandParentId: "parent_id",
                            // grandParentParentId: "parent_id",
                            id: {
                                validator: validateSlug,
                            }
                        },
                        additionalFilters: [
                            {
                                key: "available",
                                trueValue: "product_model.available_amount > product_model.frozen_amount_in_warehouse",
                                falseValue: "",
                            }
                        ],
                        visibleFields: {
                            basic: visibleFields,
                            localized: visibleLocalizedFields,
                            multiRelations: [
                                {
                                    tableName: "product_model",
                                    fields: [
                                        "sum(soled_amount) as soled_amount",
                                    ],
                                    parentId: "id",
                                    childId: "product_id",
                                    // dynamicJoin: {
                                    //     by: "product_model.index_number",
                                    //     operator: "MIN",
                                    //     defaultAnswer: '1',
                                    //     condition: "product_model.available_amount > product_model.frozen_amount_in_warehouse"
                                    // },
                                    // extraFilters: "product_model.index_number = 1"
                                    // extraFilters: "product_model.available_amount < product_model.frozen_amount_in_warehouse"
                                    // extraFilters: "((product_model.available_amount < product_model.frozen_amount_in_warehouse and product_model.index_number = 1) or product_model.available_amount < product_model.frozen_amount_in_warehouse)"
                                },
                            ],
                            singularRelations: [
                                {
                                    tableName: "product_image",
                                    fields: [
                                        "image_url",
                                    ],
                                    parentId: "id",
                                    childId: "product_id",
                                    extraFilters: "product_image.index_number = 1"
                                },
                                {
                                    tableName: "product_brand",
                                    fields: [
                                        "serial_id",
                                    ],
                                    parentId: "product_brand_id",
                                    childId: "id",
                                },
                                {
                                    tableName: "special_offer_product",
                                    fields: [
                                        "index_number as product_is_special_offer_product",
                                    ],
                                    parentId: "id",
                                    childId: "product_id",
                                },
                                {
                                    tableName: "product_model",
                                    fields: [
                                        "price",
                                        "discounted_price",
                                        "price_is_dynamic",
                                        "available_amount",
                                        "frozen_amount_in_warehouse"
                                    ],
                                    parentId: "id",
                                    childId: "product_id",
                                    dynamicJoin: {
                                        by: "product_model.index_number",
                                        operator: "MIN",
                                        defaultAnswer: '1',
                                        condition: "product_model.available_amount > product_model.frozen_amount_in_warehouse"
                                    },
                                    // extraFilters: `(
                                    //     (product_model.index_number = 1 and product_model.available_amount > product_model.frozen_amount_in_warehouse)
                                    //     OR
                                    //     (product_model.available_amount > product_model.frozen_amount_in_warehouse and product_model.index_number = 2)
                                    //     OR
                                    //     product_model.index_number = 1
                                    // )`
                                    // extraFilters: "product_model.index_number = 1"
                                    // extraFilters: "product_model.available_amount < product_model.frozen_amount_in_warehouse"
                                    // extraFilters: "((product_model.available_amount < product_model.frozen_amount_in_warehouse and product_model.index_number = 1) or product_model.available_amount < product_model.frozen_amount_in_warehouse)"
                                },
                            ],
                        }
                    }
                },
                getFile: {
                    disabled: true
                },
                getOne: {
                    disabled: false,
                    options: {
                        localize: true,
                        id: {
                            validator: validateSlug,
                            name: 'slug'
                        },
                        extraTables: [
                            {
                                displayName: "images",
                                tableName: "product_image",
                                parentId: "id",
                                childId: "product_id",
                                multiOptions: {
                                    orderBy: "index_number ASC",
                                    limit: 20
                                }
                            },
                            {
                                displayName: "product_category",
                                tableName: "product_category",
                                parentId: "product_category_id",
                                childId: "id",
                                visibleFields: {
                                    basic: ["slug"],
                                    multiRelations: [
                                        {
                                            tableName: "product_model",
                                            fields: [
                                                "max(discounted_price) as max_price",
                                            ],
                                            extraFilters: "t.discounted_price is not null and t.discounted_price > 0",
                                            parentId: "id",
                                            childId: "product_category_id",
                                        },
                                    ]
                                }
                            },
                            {
                                tableName: "special_offer_product",
                                displayName: "product_is_special_offer_product",
                                parentId: "id",
                                childId: "product_id",
                            },
                            {
                                displayName: "models",
                                tableName: "product_model",
                                parentId: "id",
                                childId: "product_id",
                                localized: true,
                                visibleFields: {
                                    singularRelations: [
                                        {
                                            tableName: "product_guaranty_localized_info",
                                            fields: [
                                                "name as product_guaranty_name",
                                            ],
                                            parentId: "product_guaranty_id",
                                            childId: "id"
                                        },
                                    ]
                                },
                                multiOptions: {
                                    orderBy: "index_number ASC",
                                    limit: 20
                                },
                                
                            },
                            {
                                displayName: "properties",
                                tableName: "product_property",
                                parentId: "id",
                                childId: "product_id",
                                localized: true,
                                multiOptions: {
                                    orderBy: "index_number ASC",
                                    limit: 20
                                }
                            },
                            {
                                displayName: "brand",
                                tableName: "product_brand",
                                parentId: "product_brand_id",
                                childId: "id",
                                localized: true,
                            },
                            {
                                displayName: "related_products",
                                tableName: "product_product",
                                parentId: "id",
                                childId: "product_id",
                                visibleFields: {
                                    singularRelations: [
                                        {
                                            tableName: "product",
                                            fields: [
                                                "slug",
                                                "weight",
                                            ],
                                            parentId: "related_product_id",
                                            childId: "id"
                                        },
                                        {
                                            tableName: "special_offer_product",
                                            fields: [
                                                "index_number as product_is_special_offer_product",
                                            ],
                                            parentId: "related_product_id",
                                            childId: "product_id",
                                        },
                                        {
                                            tableName: "product_localized_info",
                                            fields: [
                                                "name",
                                                "image_alt",
                                            ],
                                            parentId: "related_product_id",
                                            childId: "id"
                                        },
                                        {
                                            tableName: "product_image",
                                            fields: [
                                                "image_url",
                                            ],
                                            parentId: "related_product_id",
                                            childId: "product_id",
                                            extraFilters: "product_image.index_number = 1"
                                        },
                                        {
                                            tableName: "product_model",
                                            fields: [
                                                "price",
                                                "discounted_price",
                                                "price_is_dynamic",
                                                "available_amount",
                                                "frozen_amount_in_warehouse",
                                            ],
                                            parentId: "related_product_id",
                                            childId: "product_id",
                                            dynamicJoin: {
                                                by: "product_model.index_number",
                                                operator: "MIN",
                                                defaultAnswer: '1',
                                                condition: "product_model.available_amount > product_model.frozen_amount_in_warehouse"
                                            },
                                            // extraFilters: "product_model.index_number = 1"
                                        },
                                    ],
                                },
                                multiOptions: {
                                    orderBy: "index_number ASC",
                                    limit: 20
                                }
                            },
                            {
                                displayName: "available_insurances",
                                tableName: "product_available_insurance",
                                parentId: "id",
                                childId: "product_id",
                                visibleFields: {
                                    singularRelations: [
                                        {
                                            tableName: "product_insurance",
                                            fields: [
                                                "slug",
                                                "icon_url"
                                            ],
                                            parentId: "product_insurance_id",
                                            childId: "id"
                                        },
                                        {
                                            tableName: "product_insurance_localized_info",
                                            fields: [
                                                "name",
                                            ],
                                            parentId: "product_insurance_id",
                                            childId: "id"
                                        },
                                    ],
                                },
                                multiOptions: {
                                    orderBy: "index_number ASC",
                                    limit: 20
                                }
                            },
                        ],
                        inheritance: {
                            tableName: 'product_category',
                            parentId: 'product_category_id',
                            visibleFields: {
                                basic: [{
                                    key: 'slug',
                                    name: 'slug',
                                    parentKey: "slug",
                                }],
                                localized: [
                                    {
                                        key: 'name',
                                        name: 'name',
                                        parentKey: "name",
                                    },
                                    {
                                        key: 'seo_title',
                                        name: 'seo_title',
                                        parentKey: "seo_title",
                                    },
                                ],
                            }
                        },
                        additionalData: [
                            {
                                name: "info",
                                singular: true,
                                getQuery: ({data, locale}) => {
                                    return `
                                        SELECT
                                            *
                                        FROM
                                            info_localized_info
                                        WHERE
                                            id = '1' AND locale = '${locale}'
                                    `
                                }
                            },
                            {
                                name: "menu",
                                getQuery: ({data, locale}) => {
                                    return `
                                        SELECT
                                            pc.id,
                                            pc.slug,
                                            pc.homepage_index,
                                            max(pm.discounted_price) as max_price,
                                            pcl.name,
                                            COALESCE(
                                                json_agg(
                                                    CASE
                                                        WHEN c.id IS NULL THEN NULL
                                                        ELSE json_build_object('id', c.id, 'slug', c.slug, 'name', cl.name, 'max_price', pml.max_price, 'homepage_index', c.homepage_index)
                                                    END
                                                ) FILTER (WHERE c.id IS NOT NULL),
                                                '[]'::json
                                            ) AS sub_categories
                                        FROM
                                            product_category pc
                                        LEFT JOIN 
                                            product_category_localized_info pcl ON pcl.id = pc.id and pcl.locale = '${locale}'
                                        LEFT JOIN
                                            product_category c ON pc.id = c.parent_id
                                        LEFT JOIN 
                                            product_category_localized_info cl ON cl.id = c.id and cl.locale = '${locale}'
                                        LEFT JOIN 
                                            product_model pm ON  pm.product_category_id = pc.id and pm.discounted_price is not null and pm.discounted_price > 0
                                        LEFT JOIN 
                                            (
                                                SELECT pml.product_category_id, MAX(pml.discounted_price) as max_price
                                                FROM product_model pml
                                                WHERE pml.discounted_price is not null and pml.discounted_price > 0
                                                GROUP BY pml.product_category_id
                                            ) pml ON pc.id = pml.product_category_id
                                        WHERE
                                            pc.homepage_index IS NOT NULL AND pc.homepage_index <> 0 
                                        GROUP BY
                                            pc.id, pc.slug, pcl.name,pc.homepage_index
                                        ORDER BY
                                            pc.homepage_index ASC;
                                    `
                                }
                            },
                        ],
                        // extraTables: [
                        //     {
                        //         displayName: "slides",
                        //         tableName: "product_slide",
                        //         parentId: "id",
                        //         childId: "product_id",
                        //         multiOptions: {
                        //             orderBy: "index_number ASC",
                        //             limit: 20
                        //         }
                        //     },
                        // ],
                    }
                },
                checkUniqueness: {
                    disabled: true
                },
                create: {
                    disabled: true,
                    options: {
                        autoGenerateIdFunction: generateId,
                    }
                },
                update: {
                    disabled: true,
                },
                delete: {
                    disabled: true,
                },
                bulkUpdate: {
                    disabled: true,
                },
                bulkDelete: {
                    disabled: true,
                },
                createLocale: {
                    disabled: true,
                },
                updateLocale: {
                    disabled: true
                },
                deleteLocale: {
                    disabled: true
                },
                getLocale: {
                    disabled: true,
                },
                getLocales: {
                    disabled: true,
                    options: {
                        id: {
                            validator: validateULID,
                            name: 'id'
                        }
                    }
                },
            },

        }
    )
}
