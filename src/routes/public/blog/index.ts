export default (app:IApp) => {

    const {
        makeValidateString,
        makeValidateUrl,
        validateULID,
        validateDescription,
        makeValidateHTML,
        validateSlug
    } = useValidators()


    const {
        generateId,
        validateHTML: html
    } = useFrameworks()

    const validateString = makeValidateString()
    const validateHTML = makeValidateHTML(html)
    const validateUrl = makeValidateUrl(false)

    const visibleFields = [
        'id',
        'slug',
        'image_url',
        'blog_category_id',
        'published',
        'image_url',
        'created_at',
    ]
    const visibleLocalizedFields = [
        'title',
        'image_alt',
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
                tableName: 'blog',
                id: {
                    validator: validateULID,
                    dbName: 'id'
                },
                localizedFields: {
                    title: {
                        validator:validateString,
                        // filterType: "like"
                    },
                    image_alt: {
                        validator:validateString,
                        // filterType: "like"
                    },
                    content: {
                        validator: validateHTML
                    },
                    description: {
                        validator:validateDescription,
                    },
                    answer_description: {
                        validator:validateDescription,
                    },
                    intro_description: {
                        validator:validateDescription,
                    },
                },
                fields: {
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
                    published: {
                        type: "boolean",
                    },
                    blog_category_id: {
                        validator:validateULID,
                    },
                    image_url: {
                        validator:validateUrl
                    },                   
                },
            },
            routes: {
                get: {
                    disabled: false,
                    options: {
                        maxRequests: 10,
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
                                name: "page",
                                singular: true,
                                getQuery: ({data, locale}) => {
                                    return `
                                        SELECT
                                            *
                                        FROM
                                            page_localized_info
                                        WHERE
                                            id = 'blogs' AND locale = '${locale}'
                                    `
                                }
                            },
                            {
                                name: "categoriesCount",
                                singular: true,
                                getQuery: ({data, locale}) => {
                                    return `
                                        SELECT
                                            count(*) as result
                                        FROM
                                            blog_category
                                    `
                                }
                            },
                            {
                                name: "categories",
                                getQuery: ({data, locale})=> {
                                    return `
                                        SELECT blog_category_localized_info.name ,
                                            blog_category.id, blog_category.slug, blog_category.icon_url, blog_category.created_at, blog_category.last_modified_at
                                        FROM
                                            blog_category
                        
                                        LEFT JOIN
                                            blog_category_localized_info
                                        ON
                        
                                            blog_category.id = blog_category_localized_info.id and
                                            blog_category_localized_info.locale = '${locale}'
                        
                                        ORDER BY
                        
                                            blog_category.created_at desc
                                        LIMIT 20
                                        OFFSET 0
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
                        relationalFilters: [
                            {
                                tableName: "blog_blog",
                                fields: {
                                    blog_not_related_to_blog: {
                                        validator:validateULID,
                                        target: "blog_id",
                                        filterType: "!exists"
                                    }
                                },
                                parentId: "id",
                                childId: "related_blog_id",
                            },
                            {
                                tableName: "blog_tag_blog",
                                fields: {
                                    tag_included: {
                                        validator:validateULID,
                                        target: "blog_tag_id",
                                        filterType: "exists"
                                    }
                                },
                                parentId: "id",
                                childId: "blog_id",

                            },
                            {
                                tableName: "product_category_suggested_blog",
                                fields: {
                                    blog_not_suggested_to_product_category: {
                                        validator:validateULID,
                                        target: "product_category_id",
                                        filterType: "!exists"
                                    }
                                },
                                parentId: "id",
                                childId: "blog_id",
                            },
                        ],
                        visibleFields: {
                            basic: visibleFields,
                            localized: visibleLocalizedFields
                        },
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
                        extraTables: [
                            {
                                displayName: "related_blogs",
                                tableName: "blog_blog",
                                parentId: "id",
                                childId: "blog_id",
                                visibleFields: {
                                    singularRelations: [
                                        {
                                            tableName: "blog",
                                            fields: [
                                                "slug",
                                                "image_url",
                                            ],
                                            parentId: "related_blog_id",
                                            childId: "id"
                                        },
                                        {
                                            tableName: "blog_localized_info",
                                            fields: [
                                                "title",
                                                "image_alt",
                                            ],
                                            parentId: "related_blog_id",
                                            childId: "id"
                                        },
                                    ],
                                },
                                multiOptions: {
                                    orderBy: "index_number ASC",
                                    limit: 20
                                }
                            },
                            {
                                displayName: "suggested_products",
                                tableName: "blog_product",
                                parentId: "id",
                                childId: "blog_id",
                                visibleFields: {
                                    singularRelations: [
                                        {
                                            tableName: "product",
                                            fields: [
                                                "slug",
                                                "weight",
                                            ],
                                            parentId: "product_id",
                                            childId: "id"
                                        },
                                        {
                                            tableName: "product_localized_info",
                                            fields: [
                                                "name",
                                            ],
                                            parentId: "product_id",
                                            childId: "id"
                                        },
                                        {
                                            tableName: "product_image",
                                            fields: [
                                                "image_url",
                                            ],
                                            parentId: "product_id",
                                            childId: "product_id",
                                            extraFilters: "product_image.index_number = 1"
                                        },
                                        {
                                            tableName: "special_offer_product",
                                            fields: [
                                                "index_number as product_is_special_offer_product",
                                            ],
                                            parentId: "product_id",
                                            childId: "product_id",
                                        },
                                        {
                                            tableName: "product_model",
                                            fields: [
                                                "price",
                                                "price_is_dynamic",
                                                "discounted_price",
                                                "available_amount",
                                                "frozen_amount_in_warehouse",
                                            ],
                                            parentId: "product_id",
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
                                displayName: "tags",
                                tableName: "blog_tag_blog",
                                parentId: "id",
                                childId: "blog_id",
                                visibleFields: {
                                    singularRelations: [
                                        {
                                            tableName: "blog_tag",
                                            fields: [
                                                "slug",
                                                "icon_url",
                                            ],
                                            parentId: "blog_tag_id",
                                            childId: "id"
                                        },
                                        {
                                            tableName: "blog_tag_localized_info",
                                            fields: [
                                                "name",
                                            ],
                                            parentId: "blog_tag_id",
                                            childId: "id"
                                        },
                                    ],
                                },
                                multiOptions: {
                                    orderBy: "index_number ASC",
                                    limit: 20
                                }
                            },
                        ]
                    }
                },
                checkUniqueness: {
                    disabled: true
                },
                create: {
                    disabled: true,
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
