export default (app:IApp) => {

    const {
        makeValidateString,
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
                },
            },
            routes: {
                get: {
                    disabled: false,
                    options: {
                        maxRequests: 10,
                        dontPassTableName: true,
                        defaultOrderBy: "(product_model.available_amount > product_model.frozen_amount_in_warehouse is false)",
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
                                tableName: "special_offer_product",
                                fields: {
                                    product_is_special_offer: {
                                        type: "boolean",
                                        filterType: "existence"
                                    }
                                },
                                parentId: "id",
                                childId: "product_id",
                            },
                            {
                                tableName: "product_filter",
                                fields: {
                                    filters: {
                                        secondField: "product_category_filter_id",
                                        secondFieldValidator: validateULID,
                                        filterType: "exists",
                                        allowedToBeArray: true,
                                        validator: validateULID,
                                        target: "product_category_filter_value_id"
                                    },
                                },
                                parentId: "id",
                                childId: "product_id",
                            },
                            {
                                tableName: "product_brand",
                                fields: {
                                    product_brand_slug: {
                                        target: "slug",
                                        filterType: "exists",
                                        validator: validateSlug
                                    },
                                },
                                parentId: "product_brand_id",
                                childId: "id",
                                // extraFilters: "product_model.index_number = 1"
                            },
                        ],
                        inheritanceFilter: {
                            tableName: "product_category",
                            parentId: "product_category_id",
                            // grandParentParentId: "parent_id",
                            id: {
                                validator: validateULID,
                            }
                        },
                        additionalFilters: [
                            {
                                key: "available",
                                trueValue: "product_model.available_amount > product_model.frozen_amount_in_warehouse",
                                falseValue: "",
                            }
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
                                name: "origin",
                                singular: true,
                                getQuery: ({data, locale}) => {
                                    if (data?.product_brand_slug) {
                                        return `
                                            SELECT
                                                b.icon_url,
                                                bl.name,
                                                bl.seo_title,
                                                bl.seo_description,
                                                bl.image_url,
                                                bl.tags,
                                                bl.description,
                                                (SELECT bl2.content FROM product_brand_localized_info bl2 WHERE bl2.id = bl.id LIMIT 1) as content,
                                                max(m.discounted_price) as max_price
                                            FROM
                                                product_brand b
                                            LEFT JOIN
                                                product_brand_localized_info bl
                                            ON
                                                b.id = bl.id AND locale = '${locale}'
                                            LEFT JOIN
                                                product_model m
                                            ON
                                                b.id = m.product_brand_id and m.discounted_price is not null and m.discounted_price > 0
                                            WHERE
                                                b.slug = '${data.product_brand_slug}'
                                            GROUP BY
                                                b.icon_url,
                                                bl.id,
                                                bl.name,
                                                bl.seo_title,
                                                bl.seo_description,
                                                bl.image_url,
                                                bl.tags,
                                                bl.description
                                        `
                                    }else if (data.name){
                                        return `
                                            SELECT
                                                max(m.discounted_price) as max_price
                                            FROM
                                                product_localized_info p
                                            LEFT JOIN
                                                product_model m
                                            ON
                                                p.id = m.product_id and m.discounted_price is not null and m.discounted_price > 0
                                            WHERE
                                                p.name ILIKE '%${data.name}%'
                                        `
                                    }else {
                                        return `
                                            SELECT
                                                max(m.discounted_price) as max_price
                                            FROM
                                                product p
                                            LEFT JOIN
                                                product_model m
                                            ON
                                                p.id = m.product_id and m.discounted_price is not null and m.discounted_price > 0
                                            WHERE EXISTS (
                                                SELECT 1
                                                FROM 
                                                    special_offer_product s
                                                WHERE p.id = s.product_id
                                            )
                                        `
                                    }
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
                                        // "max(discounted_price) as max_price",
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
                    disabled: true,
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
