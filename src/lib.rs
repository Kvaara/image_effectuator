use std::io::Cursor;

use base64::{decode, encode};
use image::load_from_memory;
use image::ImageOutputFormat::Png;
use wasm_bindgen::prelude::*;

use web_sys::console::log_1 as log;

#[wasm_bindgen]
pub fn grayscale(encoded_file: &str) -> String {
    let base64_to_vector = decode(encoded_file).unwrap();

    let mut img = load_from_memory(&base64_to_vector).unwrap();

    img = img.grayscale();

    let mut buffer = Cursor::new(vec![]);

    img.write_to(&mut buffer, Png).unwrap();

    let vector_to_base64 = encode(&buffer.get_ref());

    let data_url = format!("data:image/png;base64,{}", vector_to_base64);

    return data_url;
}

#[wasm_bindgen]
pub fn blur(encoded_file: &str) -> String {
    let base64_to_vector = decode(encoded_file).unwrap();

    let mut img = load_from_memory(&base64_to_vector).unwrap();

    img = img.blur(10.5);

    let mut buffer = Cursor::new(vec![]);

    img.write_to(&mut buffer, Png).unwrap();

    let vector_to_base64 = encode(&buffer.get_ref());

    let data_url = format!("data:image/png;base64,{}", vector_to_base64);

    return data_url;
}

#[wasm_bindgen]
pub fn brighten(encoded_file: &str) -> String {
    let base64_to_vector = decode(encoded_file).unwrap();

    let mut img = load_from_memory(&base64_to_vector).unwrap();

    img = img.brighten(50);

    let mut buffer = Cursor::new(vec![]);

    img.write_to(&mut buffer, Png).unwrap();

    let vector_to_base64 = encode(&buffer.get_ref());

    let data_url = format!("data:image/png;base64,{}", vector_to_base64);

    return data_url;
}
