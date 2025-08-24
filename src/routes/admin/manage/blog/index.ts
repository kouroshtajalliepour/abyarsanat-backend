export default (app:IApp) => {
    const {
        adminIsAuthenticated
    } = useMiddlewares();

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
        'created_at',
        'last_modified_at'
    ]
    const visibleLocalizedFields = [
        'title',
        'image_alt',

        'description',
        'answer_description',
        'intro_description',

        'content',
    ]

    return useRoutes(
        {
            app,
            middleware: [adminIsAuthenticated, adminHasAccessTo],
            options: {
                // collectView: true,
                collectLog: true,
                serverJsonSizeLimit: "1mb",
                serverUrlEncodedSizeLimit: "1mb",
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
                        filterType: "like"
                    },
                    image_alt: {
                        validator:validateString,
                        filterType: "like"
                    },
                    content: {
                        validator: validateHTML
                    },
                    description: {
                        validator: validateHTML,
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
                    disabled: false,
                    options: {
                        relationalFilters: [
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
                getOne: {
                    disabled: false,
                    options: {
                        localize: true,
                        id: {
                            validator: validateULID,
                            name: 'id'
                        },
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
                                                "image_url"
                                            ],
                                            parentId: "related_blog_id",
                                            childId: "id"
                                        },
                                        {
                                            tableName: "blog_localized_info",
                                            fields: [
                                                "title",
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
                    disabled: false
                },
                create: {
                    disabled: false,
                    options: {
                        autoGenerateIdFunction: generateId,
                    }
                },
                update: {
                    disabled: false,
                },
                delete: {
                    disabled: false,
                },
                bulkUpdate: {
                    disabled: true,
                },
                bulkDelete: {
                    disabled: true,
                },
                createLocale: {
                    disabled: false,
                },
                updateLocale: {
                    disabled: false
                },
                deleteLocale: {
                    disabled: false
                },
                getLocale: {
                    disabled: false,
                },
                getLocales: {
                    disabled: false,
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

    async function adminHasAccessTo(request:any) {
        const admin = request.md_data.author

        if (admin.role_id) {
            const accessGroups = admin.role_access_level.map((al:any) => {
                return al.access_group
            })

            if (!accessGroups.includes('blogManagement')) {
                return {
                    statusCode: 403,
                    body: {
                        message: "useCases.errors.general.accessDenied"
                    }
                }
            }

        }
        return {
            statusCode: 200,
            body: {}
        }
    }
}
