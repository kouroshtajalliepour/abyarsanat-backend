-- * search
CREATE INDEX idx_product_category_name ON product_category_localized_info USING gin (name gin_trgm_ops);
CREATE INDEX idx_product_name ON product_localized_info USING gin (name gin_trgm_ops);

-- * product category
CREATE INDEX product_category_id_parent_id_idx ON product_category (parent_id);

-- * product category filter & filter values
CREATE INDEX idx_product_category_filter_product_category_id ON product_category_filter(product_category_id);
CREATE INDEX idx_product_category_filter_value_product_category_id ON product_category_filter_value(product_category_id);

-- * product 
CREATE INDEX idx_product_pid ON product(pid);
CREATE INDEX idx_product_created_at ON product(created_at);
CREATE INDEX idx_product_product_category_id ON product(product_category_id);
CREATE INDEX idx_product_product_brand_id ON product(product_brand_id);
-- * product related
CREATE INDEX product_image_product_id_idx ON product_image (product_id, index_number);
CREATE INDEX idx_product_product_product_related ON product_product(product_id, related_product_id);
CREATE INDEX product_filter_product_id_category_filter_idx ON product_filter (product_id, product_category_filter_id, product_category_filter_value_id);
CREATE INDEX idx_product_filter_product_id_value ON product_filter(product_id, product_category_filter_value_id);
CREATE INDEX product_property_product_id_idx ON product_property(product_id);
CREATE INDEX special_offer_product_product_id_idx ON special_offer_product (product_id);

-- * product model
CREATE INDEX product_model_product_category_id_idx ON product_model (product_category_id);
CREATE INDEX product_model_product_brand_id_idx ON product_model (product_brand_id);
CREATE INDEX idx_product_model_product_id_index_number ON product_model (product_id, index_number);
CREATE INDEX idx_product_model_available_amount ON product_model (available_amount);
CREATE INDEX product_model_price_log_product_model_id_idx ON product_model_price_log(product_model_id);

-- * user
CREATE INDEX user_address_user_id_idx ON user_address (user_id);
CREATE INDEX user_address_user_phone_number_idx ON _user (phone_number);
CREATE INDEX user_transaction_user_id_idx ON user_transaction (user_id);