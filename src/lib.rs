use std::fmt::format;
use std::io::Cursor;

use base64::{decode, encode};
use image::load_from_memory;
use image::ImageOutputFormat::Png;
use wasm_bindgen::prelude::*;
use web_sys::console::log_1 as log;

#[wasm_bindgen]
pub fn grayscale(encoded_file: &str) -> String {
    log(&"Grayscale called".into());

    let base64_to_vector = decode(encoded_file).unwrap();
    log(&"Image decoded".into());

    let mut img = load_from_memory(&base64_to_vector).unwrap();
    log(&"Image loaded".into());

    img = img.grayscale();
    log(&"Image grayscale applied".into());

    let mut buffer = Cursor::new(vec![]);

    img.write_to(&mut buffer, Png).unwrap();
    log(&"New image written".into());

    let vector_to_base64 = encode(&buffer.get_ref());
    log(&"New image buffer encoded to Base64".into());

    let data_url = format!("data:image/png;base64,{}", vector_to_base64);

    return data_url;
}
