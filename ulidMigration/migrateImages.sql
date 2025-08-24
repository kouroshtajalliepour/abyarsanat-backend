BEGIN;

SET LOCAL app.no_collection = t;

ALTER TABLE product_image ALTER COLUMN image_url DROP NOT NULL;
UPDATE product_image SET image_url = full_screen_image_url;

ALTER TABLE page_localized_info DROP column mobile_image_url;
ALTER TABLE page_slide DROP column mobile_image_url;
ALTER TABLE page_banner DROP column mobile_image_url;
ALTER TABLE info_localized_info DROP column main_banner_mobile_image_url;
ALTER TABLE blog DROP column mobile_image_url;
ALTER TABLE product_brand_slide DROP column mobile_image_url;
ALTER TABLE product_category_slide DROP column mobile_image_url;
ALTER TABLE product_image DROP column mobile_image_url;
ALTER TABLE product_image DROP column full_screen_image_url;


-- tags logics

ALTER TABLE page_localized_info ADD column tags VARCHAR(100);
ALTER TABLE product_localized_info ADD column tags VARCHAR(100);
ALTER TABLE product_category_localized_info ADD column tags VARCHAR(100);
ALTER TABLE product_brand_localized_info ADD column tags VARCHAR(100);
ALTER TABLE product_brand_localized_info ADD column seo_title VARCHAR(100);
ALTER TABLE product_brand_localized_info ADD column seo_description VARCHAR(500);

COMMIT;


-- * product_model_images

ALTER TABLE product_model ADD COLUMN image_url VARCHAR(200);
ALTER TABLE product_category_localized_info ADD COLUMN image_url VARCHAR(200);
ALTER TABLE product_brand_localized_info ADD COLUMN image_url VARCHAR(200);