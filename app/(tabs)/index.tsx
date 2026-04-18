import 'react-native-url-polyfill/auto';
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, TextInput, Clipboard, Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://oksemloetsneadfjqpew.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9rc2VtbG9ldHNuZWFkZmpxcGV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxMjk4OTQsImV4cCI6MjA5MTcwNTg5NH0.DZwavTBWbk0pnpmVkMbXfezgsnYygnmbQRyFQ8AgtCU';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const SensiLogo = require('./ff_sensitivity_logo.png');

const MARCAS: string[] = ['Apple', 'Samsung', 'Xiaomi', 'Tecno', 'Infinix', 'Huawei', 'Motorola', 'Honor', 'Tablets'];

interface Config {
  gen: string;
  rojo: string;
  x2: string;
  x4: string;
  awm: string;
  c360: string;
  dpi: string;
  boton: string;
  sup: string;
  velPuntero?: string;
  accesibilidad?: string;
  modoSports?: string;
}
const MODELOS_POR_MARCA: Record<string, string[]> = {
  'Apple': ['iPhone 11', 'iPhone 11 Pro', 'iPhone 11 Pro Max', 'iPhone 12', 'iPhone 12 Pro', 'iPhone 12 Pro Max', 'iPhone 13', 'iPhone 13 Pro', 'iPhone 13 Pro Max', 'iPhone 14', 'iPhone 14 Plus', 'iPhone 14 Pro', 'iPhone 14 Pro Max', 'iPhone 15', 'iPhone 15 Plus', 'iPhone 15 Pro', 'iPhone 15 Pro Max', 'iPhone 16', 'iPhone 16 Plus', 'iPhone 16 Pro', 'iPhone 16 Pro Max', 'iPhone 17', 'iPhone 17 Pro', 'iPhone 17 Pro Max', 'iPhone 18 Ultra (2026)', 'Genérica Apple'],
  'Samsung': ['Samsung S21 FE', 'Samsung S21', 'Samsung S21+', 'Samsung S21 Ultra', 'Samsung S22', 'Samsung S22+', 'Samsung S22 Ultra', 'Samsung S23 FE', 'Samsung S23', 'Samsung S23+', 'Samsung S23 Ultra', 'Samsung S24', 'Samsung S24+', 'Samsung S24 Ultra', 'Samsung S25', 'Samsung S25+', 'Samsung S25 Ultra', 'Samsung S26 Ultra', 'Samsung A34 5G', 'Samsung A54 5G', 'Samsung A35 5G', 'Samsung A55 5G', 'Samsung A56 (2026)', 'Genérica Samsung'],
  'Xiaomi': ['Poco X3 Pro', 'Poco X4 Pro', 'Poco X5 Pro', 'Poco X6 Pro', 'Poco F4', 'Poco F5', 'Poco F5 Pro', 'Poco F6', 'Poco F6 Pro', 'Poco F7 Pro (2026)', 'Redmi Note 12', 'Redmi Note 12 Pro', 'Redmi Note 12 Pro+', 'Redmi Note 13', 'Redmi Note 13 Pro', 'Redmi Note 13 Pro+', 'Redmi Note 14', 'Redmi Note 14 Pro', 'Redmi Note 14 Pro+', 'Redmi Note 15 Pro (2026)', 'Xiaomi 13T Pro', 'Xiaomi 14 Ultra', 'Genérica Xiaomi'],
  'Tecno': ['Tecno Spark 10 Pro', 'Tecno Spark 20', 'Tecno Spark 20 Pro', 'Tecno Spark 20 Pro+', 'Tecno Spark 30 (2026)', 'Tecno Pova 5', 'Tecno Pova 5 Pro', 'Tecno Pova 6', 'Tecno Pova 6 Pro', 'Tecno Pova 6 Neo', 'Tecno Camon 20', 'Tecno Camon 20 Pro', 'Tecno Camon 20 Premier', 'Tecno Camon 30', 'Tecno Camon 30 Pro', 'Tecno Camon 30 Premier', 'Tecno Camon 40 4G', 'Tecno Camon 40 Pro (2026)', 'Tecno Camon 40 Premier (2026)', 'Genérica Tecno'],
  'Infinix': ['Infinix Hot 20', 'Infinix Hot 20S', 'Infinix Note 20', 'Infinix Note 20 Pro', 'Infinix Zero 20', 'Infinix Zero Ultra', 'Infinix Hot 30', 'Infinix Hot 40', 'Infinix Hot 40 Pro', 'Infinix Hot 50 (2026)', 'Infinix Note 30', 'Infinix Note 30 Pro', 'Infinix Note 30 VIP', 'Infinix Note 40', 'Infinix Note 40 Pro', 'Infinix Note 40 Pro+', 'Infinix Note 50 VIP (2026)', 'Infinix GT 10 Pro', 'Infinix GT 20 Pro', 'Genérica Infinix'],
  'Motorola': ['Moto G60', 'Moto G200', 'Edge 30', 'Edge 30 Pro', 'Edge 30 Ultra', 'Edge 40', 'Edge 40 Neo', 'Edge 40 Pro', 'Edge 50 Pro', 'Edge 50 Ultra', 'Edge 60 Pro (2026)', 'Genérica Motorola'],
  'Huawei': ['Huawei P50', 'Huawei P50 Pro', 'Huawei P60', 'Huawei P60 Pro', 'Huawei P70', 'Huawei P70 Pro', 'Huawei Mate 50 Pro', 'Huawei Mate 60 Pro', 'Genérica Huawei'],
  'Honor': ['Honor 70', 'Honor 90', 'Honor 90 Lite', 'Honor 100', 'Honor 100 Pro', 'Honor 200', 'Honor 200 Pro', 'Honor 110 Pro', 'Honor 120 Ultra (2026)', 'Honor Magic 5 Pro', 'Honor Magic 6 Pro', 'Genérica Honor'],
  'Tablets': ['iPad 9na Gen', 'iPad 10ma Gen', 'iPad Pro 11"', 'iPad Pro 12.9"', 'Galaxy Tab S7', 'Galaxy Tab S8', 'Galaxy Tab S9', 'Xiaomi Pad 5', 'Xiaomi Pad 6', 'Poco Pad']
};
// Base de datos reducida para optimizar, rellena con el resto si lo necesitas
const DB_CONFIGS: Record<string, Config> = {
  "iPhone 11": { gen: '190', rojo: '185', x2: '180', x4: '175', awm: '50', c360: '80', dpi: 'Refinado 110', boton: '55', sup: '0.15s' },
  "iPhone 11 Pro": { gen: '192', rojo: '186', x2: '182', x4: '178', awm: '50', c360: '80', dpi: 'Refinado 110', boton: '53', sup: '0.12s' },
  "iPhone 11 Pro Max": { gen: '194', rojo: '188', x2: '185', x4: '180', awm: '50', c360: '80', dpi: 'Sencillo 115', boton: '50', sup: '0.12s' },
  "iPhone 12": { gen: '194', rojo: '188', x2: '182', x4: '178', awm: '50', c360: '80', dpi: 'Refinado 115', boton: '50', sup: '0.10s' },
  "iPhone 12 Pro": { gen: '195', rojo: '190', x2: '185', x4: '180', awm: '50', c360: '80', dpi: 'Deslizante 115', boton: '48', sup: '0.10s' },
  "iPhone 12 Pro Max": { gen: '196', rojo: '192', x2: '188', x4: '182', awm: '50', c360: '80', dpi: 'Deslizante 115', boton: '46', sup: '0.10s' },
  "iPhone 13": { gen: '195', rojo: '190', x2: '185', x4: '180', awm: '50', c360: '80', dpi: 'Refinado 115', boton: '48', sup: '0.10s' },
  "iPhone 13 Pro": { gen: '198', rojo: '192', x2: '188', x4: '182', awm: '50', c360: '80', dpi: 'Deslizante 115', boton: '46', sup: '0.08s' },
  "iPhone 13 Pro Max": { gen: '198', rojo: '194', x2: '190', x4: '185', awm: '50', c360: '80', dpi: 'Deslizante 120', boton: '44', sup: '0.08s' },
  "iPhone 14": { gen: '198', rojo: '192', x2: '188', x4: '185', awm: '50', c360: '80', dpi: 'Refinado 115', boton: '46', sup: '0.08s' },
  "iPhone 14 Plus": { gen: '198', rojo: '192', x2: '188', x4: '185', awm: '50', c360: '80', dpi: 'Refinado 115', boton: '46', sup: '0.08s' },
  "iPhone 14 Pro": { gen: '200', rojo: '195', x2: '192', x4: '188', awm: '50', c360: '80', dpi: 'Deslizante 120', boton: '44', sup: '0.05s' },
  "iPhone 14 Pro Max": { gen: '200', rojo: '198', x2: '195', x4: '190', awm: '50', c360: '80', dpi: 'Deslizante 120', boton: '43', sup: '0.05s' },
  "iPhone 15": { gen: '200', rojo: '195', x2: '190', x4: '188', awm: '50', c360: '80', dpi: 'Refinado 120', boton: '45', sup: '0.05s' },
  "iPhone 15 Plus": { gen: '200', rojo: '195', x2: '190', x4: '188', awm: '50', c360: '80', dpi: 'Refinado 120', boton: '45', sup: '0.05s' },
  "iPhone 15 Pro": { gen: '200', rojo: '198', x2: '194', x4: '190', awm: '50', c360: '80', dpi: 'Deslizante 120', boton: '43', sup: '0.05s' },
  "iPhone 15 Pro Max": { gen: '200', rojo: '200', x2: '198', x4: '195', awm: '50', c360: '80', dpi: 'Deslizante 120', boton: '42', sup: '0.05s' },
  "iPhone 16": { gen: '200', rojo: '198', x2: '194', x4: '190', awm: '50', c360: '80', dpi: 'Refinado 120', boton: '44', sup: '0.05s' },
  "iPhone 16 Plus": { gen: '200', rojo: '198', x2: '194', x4: '190', awm: '50', c360: '80', dpi: 'Refinado 120', boton: '44', sup: '0.05s' },
  "iPhone 16 Pro": { gen: '200', rojo: '200', x2: '196', x4: '192', awm: '50', c360: '80', dpi: 'Deslizante 120', boton: '42', sup: '0.05s' },
  "iPhone 16 Pro Max": { gen: '200', rojo: '200', x2: '198', x4: '195', awm: '50', c360: '80', dpi: 'Deslizante 120', boton: '40', sup: '0.05s' },
  "iPhone 17": { gen: '200', rojo: '200', x2: '196', x4: '192', awm: '50', c360: '80', dpi: 'Refinado 120', boton: '42', sup: '0.05s' },
  "iPhone 17 Pro": { gen: '200', rojo: '200', x2: '198', x4: '195', awm: '50', c360: '80', dpi: 'Deslizante 120', boton: '40', sup: '0.05s' },
  "iPhone 17 Pro Max": { gen: '200', rojo: '200', x2: '200', x4: '198', awm: '50', c360: '80', dpi: 'Deslizante 120', boton: '38', sup: '0.05s' },
  "iPhone 18 Ultra (2026)": { gen: '200', rojo: '200', x2: '200', x4: '200', awm: '50', c360: '80', dpi: 'Deslizante 120', boton: '35', sup: '0.05s' },
  "Genérica Apple": { gen: '198', rojo: '190', x2: '185', x4: '180', awm: '50', c360: '80', dpi: 'Refinado 115', boton: '50', sup: '0.10s' },
  "Samsung S21 FE": { gen: '190', rojo: '185', x2: '180', x4: '175', awm: '50', c360: '80', dpi: '550', boton: '50', sup: '0.8ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda Puntual (Vel: 15.5 cm/s | Dem: 0.05s | 5 Rep)' },
  "Samsung S21": { gen: '190', rojo: '185', x2: '180', x4: '175', awm: '50', c360: '80', dpi: '560', boton: '50', sup: '0.8ms', velPuntero: 'Al máximo', accesibilidad: 'Escaneo Auto (Vel: 0.40s | Dem: 0.20s | 2 Rep)' },
  "Samsung S21+": { gen: '192', rojo: '186', x2: '182', x4: '178', awm: '50', c360: '80', dpi: '580', boton: '48', sup: '0.6ms', velPuntero: 'Al máximo', accesibilidad: 'Escaneo Auto (Vel: 0.30s | Dem: 0.15s | 3 Rep)' },
  "Samsung S21 Ultra": { gen: '194', rojo: '188', x2: '185', x4: '180', awm: '50', c360: '80', dpi: '600', boton: '46', sup: '0.6ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda Puntual (Vel: 25.0 cm/s | Dem: 0.01s | 10 Rep)' },
  "Samsung S22": { gen: '192', rojo: '188', x2: '182', x4: '178', awm: '50', c360: '80', dpi: '580', boton: '48', sup: '0.6ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda Puntual (Vel: 22.0 cm/s | Dem: 0.01s | 8 Rep)' },
  "Samsung S22+": { gen: '194', rojo: '190', x2: '185', x4: '180', awm: '50', c360: '80', dpi: '600', boton: '46', sup: '0.5ms', velPuntero: 'Al máximo', accesibilidad: 'Escaneo Auto (Vel: 0.20s | Dem: 0.10s | 4 Rep)' },
  "Samsung S22 Ultra": { gen: '196', rojo: '192', x2: '188', x4: '182', awm: '50', c360: '80', dpi: '620', boton: '45', sup: '0.5ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda Puntual (Vel: 31.0 cm/s | Dem: 0.00s | 15 Rep)' },
  "Samsung S23 FE": { gen: '194', rojo: '190', x2: '185', x4: '180', awm: '50', c360: '80', dpi: '600', boton: '46', sup: '0.6ms', velPuntero: 'Al máximo', accesibilidad: 'Escaneo Auto (Vel: 0.15s | Dem: 0.10s | 3 Rep)' },
  "Samsung S23": { gen: '195', rojo: '192', x2: '188', x4: '182', awm: '50', c360: '80', dpi: '620', boton: '45', sup: '0.5ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda Puntual (Vel: 28.0 cm/s | Dem: 0.00s | 12 Rep)' },
  "Samsung S23+": { gen: '196', rojo: '194', x2: '190', x4: '185', awm: '50', c360: '80', dpi: '640', boton: '44', sup: '0.4ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda Puntual (Vel: 33.5 cm/s | Dem: 0.00s | 15 Rep)' },
  "Samsung S23 Ultra": { gen: '198', rojo: '196', x2: '192', x4: '188', awm: '50', c360: '80', dpi: '680', boton: '42', sup: '0.3ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda Puntual (Vel: 45.0 cm/s | Dem: 0.00s | Infinity)' },
  "Samsung S24": { gen: '198', rojo: '194', x2: '190', x4: '186', awm: '50', c360: '80', dpi: '650', boton: '44', sup: '0.3ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda Puntual (Vel: 35.0 cm/s | Dem: 0.00s | 15 Rep)' },
  "Samsung S24+": { gen: '198', rojo: '196', x2: '192', x4: '188', awm: '50', c360: '80', dpi: '680', boton: '43', sup: '0.2ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda Puntual (Vel: 42.0 cm/s | Dem: 0.00s | Infinity)' },
  "Samsung S24 Ultra": { gen: '200', rojo: '198', x2: '195', x4: '190', awm: '60', c360: '100', dpi: '700', boton: '40', sup: 'Desactivado', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda Puntual (Vel: 55.0 cm/s | Dem: 0.00s | Infinity)' },
  "Samsung S25": { gen: '200', rojo: '196', x2: '192', x4: '188', awm: '50', c360: '80', dpi: '680', boton: '42', sup: '0.2ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda Puntual (Vel: 48.0 cm/s | Dem: 0.00s | Infinity)' },
  "Samsung S25+": { gen: '200', rojo: '198', x2: '195', x4: '190', awm: '50', c360: '80', dpi: '700', boton: '41', sup: '0.1ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda Puntual (Vel: 60.0 cm/s | Dem: 0.00s | Infinity)' },
  "Samsung S25 Ultra": { gen: '200', rojo: '200', x2: '198', x4: '194', awm: '50', c360: '80', dpi: '720', boton: '40', sup: 'Desactivado', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda Puntual (Vel: 85.0 cm/s | Dem: 0.00s | Infinity)' },
  "Samsung S26 Ultra": { gen: '200', rojo: '200', x2: '200', x4: '198', awm: '50', c360: '80', dpi: '750', boton: '38', sup: 'Desactivado', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda Puntual (Vel: 100.0 cm/s | Dem: 0.00s | Infinity)' },
  "Samsung A34 5G": { gen: '190', rojo: '185', x2: '180', x4: '175', awm: '50', c360: '80', dpi: '550', boton: '50', sup: '0.8ms', velPuntero: 'Al máximo', accesibilidad: 'Escaneo Auto (Vel: 0.60s | Dem: 0.40s | 2 Rep)' },
  "Samsung A35 5G": { gen: '192', rojo: '188', x2: '182', x4: '178', awm: '50', c360: '80', dpi: '580', boton: '48', sup: '0.6ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda Puntual (Vel: 12.0 cm/s | Dem: 0.08s | 5 Rep)' },
  "Samsung A54 5G": { gen: '194', rojo: '190', x2: '185', x4: '180', awm: '50', c360: '80', dpi: '600', boton: '46', sup: '0.5ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda Puntual (Vel: 14.5 cm/s | Dem: 0.05s | 6 Rep)' },
  "Samsung A55 5G": { gen: '196', rojo: '192', x2: '188', x4: '182', awm: '50', c360: '80', dpi: '620', boton: '45', sup: '0.4ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda Puntual (Vel: 18.0 cm/s | Dem: 0.02s | 8 Rep)' },
  "Samsung A56 (2026)": { gen: '198', rojo: '195', x2: '190', x4: '185', awm: '50', c360: '80', dpi: '650', boton: '44', sup: '0.2ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda Puntual (Vel: 22.0 cm/s | Dem: 0.01s | 10 Rep)' },
  "Genérica Samsung": { gen: '190', rojo: '185', x2: '180', x4: '175', awm: '50', c360: '80', dpi: '550', boton: '48', sup: '0.6ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda Puntual (Vel: 10.0 cm/s | Dem: 0.08s | 5 Rep)' },
  "Poco X3 Pro": { gen: '195', rojo: '190', x2: '185', x4: '180', awm: '50', c360: '80', dpi: '600', boton: '48', sup: '0.8ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda Puntual (Vel: 18.5 cm/s | Dem: 0.05s | 8 Rep)' },
  "Poco X4 Pro": { gen: '192', rojo: '188', x2: '182', x4: '178', awm: '50', c360: '80', dpi: '550', boton: '50', sup: '0.8ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda Puntual (Vel: 12.0 cm/s | Dem: 0.08s | 5 Rep)' },
  "Poco X5 Pro": { gen: '196', rojo: '192', x2: '188', x4: '182', awm: '50', c360: '80', dpi: '620', boton: '46', sup: '0.6ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda Puntual (Vel: 24.0 cm/s | Dem: 0.02s | 10 Rep)' },
  "Poco X6 Pro": { gen: '198', rojo: '195', x2: '190', x4: '185', awm: '45', c360: '75', dpi: '650', boton: '44', sup: '0.4ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda Puntual (Vel: 32.5 cm/s | Dem: 0.00s | 15 Rep)' },
  "Poco F4": { gen: '196', rojo: '192', x2: '188', x4: '184', awm: '50', c360: '80', dpi: '620', boton: '45', sup: '0.6ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda Puntual (Vel: 26.0 cm/s | Dem: 0.01s | 10 Rep)' },
  "Poco F5": { gen: '198', rojo: '195', x2: '190', x4: '185', awm: '50', c360: '80', dpi: '650', boton: '44', sup: '0.4ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda Puntual (Vel: 38.0 cm/s | Dem: 0.00s | 15 Rep)' },
  "Poco F5 Pro": { gen: '200', rojo: '196', x2: '192', x4: '188', awm: '50', c360: '80', dpi: '680', boton: '43', sup: '0.2ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda Puntual (Vel: 45.0 cm/s | Dem: 0.00s | Infinity)' },
  "Poco F6": { gen: '200', rojo: '198', x2: '194', x4: '190', awm: '50', c360: '80', dpi: '680', boton: '42', sup: '0.2ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda Puntual (Vel: 52.0 cm/s | Dem: 0.00s | Infinity)' },
  "Poco F6 Pro": { gen: '200', rojo: '200', x2: '196', x4: '192', awm: '50', c360: '80', dpi: '700', boton: '40', sup: 'Desactivado', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda Puntual (Vel: 65.0 cm/s | Dem: 0.00s | Infinity)' },
  "Poco F7 Pro (2026)": { gen: '200', rojo: '200', x2: '198', x4: '195', awm: '50', c360: '80', dpi: '720', boton: '38', sup: 'Desactivado', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda Puntual (Vel: 80.0 cm/s | Dem: 0.00s | Infinity)' },
  "Redmi Note 12": { gen: '190', rojo: '185', x2: '180', x4: '175', awm: '50', c360: '80', dpi: '500', boton: '50', sup: '0.8ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda Puntual (Vel: 2.50 cm/s | Dem: 0.20s | 3 Rep)' },
  "Redmi Note 12 Pro": { gen: '194', rojo: '190', x2: '185', x4: '180', awm: '50', c360: '80', dpi: '550', boton: '48', sup: '0.6ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda Puntual (Vel: 8.00 cm/s | Dem: 0.10s | 5 Rep)' },
  "Redmi Note 12 Pro+": { gen: '195', rojo: '192', x2: '188', x4: '182', awm: '50', c360: '80', dpi: '580', boton: '46', sup: '0.5ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda Puntual (Vel: 12.5 cm/s | Dem: 0.08s | 6 Rep)' },
  "Redmi Note 13": { gen: '192', rojo: '188', x2: '182', x4: '178', awm: '50', c360: '80', dpi: '520', boton: '48', sup: '0.7ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda Puntual (Vel: 5.50 cm/s | Dem: 0.15s | 4 Rep)' },
  "Redmi Note 13 Pro": { gen: '196', rojo: '192', x2: '188', x4: '184', awm: '50', c360: '80', dpi: '600', boton: '45', sup: '0.5ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda Puntual (Vel: 16.0 cm/s | Dem: 0.05s | 8 Rep)' },
  "Redmi Note 13 Pro+": { gen: '198', rojo: '195', x2: '190', x4: '185', awm: '50', c360: '80', dpi: '620', boton: '44', sup: '0.4ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda Puntual (Vel: 21.0 cm/s | Dem: 0.02s | 10 Rep)' },
  "Redmi Note 14": { gen: '194', rojo: '190', x2: '185', x4: '180', awm: '50', c360: '80', dpi: '550', boton: '46', sup: '0.6ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda Puntual (Vel: 9.00 cm/s | Dem: 0.10s | 5 Rep)' },
  "Redmi Note 14 Pro": { gen: '198', rojo: '195', x2: '190', x4: '185', awm: '50', c360: '80', dpi: '620', boton: '43', sup: '0.4ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda Puntual (Vel: 25.5 cm/s | Dem: 0.01s | 12 Rep)' },
  "Redmi Note 14 Pro+": { gen: '200', rojo: '198', x2: '194', x4: '188', awm: '50', c360: '80', dpi: '650', boton: '42', sup: '0.2ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda Puntual (Vel: 34.0 cm/s | Dem: 0.00s | 15 Rep)' },
  "Redmi Note 15 Pro (2026)": { gen: '200', rojo: '200', x2: '196', x4: '192', awm: '50', c360: '80', dpi: '680', boton: '40', sup: 'Desactivado', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda Puntual (Vel: 42.5 cm/s | Dem: 0.00s | Infinity)' },
  "Xiaomi 13T Pro": { gen: '200', rojo: '196', x2: '192', x4: '188', awm: '50', c360: '80', dpi: '680', boton: '42', sup: '0.2ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda Puntual (Vel: 46.0 cm/s | Dem: 0.00s | Infinity)' },
  "Xiaomi 14 Ultra": { gen: '200', rojo: '200', x2: '198', x4: '195', awm: '50', c360: '80', dpi: '720', boton: '38', sup: 'Desactivado', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda Puntual (Vel: 68.0 cm/s | Dem: 0.00s | Infinity)' },
  "Genérica Xiaomi": { gen: '194', rojo: '188', x2: '182', x4: '178', awm: '50', c360: '80', dpi: '550', boton: '48', sup: '0.6ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda Puntual (Vel: 10.0 cm/s | Dem: 0.08s | 5 Rep)' },
  "Tecno Spark 10 Pro": { gen: '192', rojo: '188', x2: '182', x4: '178', awm: '50', c360: '80', dpi: '480', boton: '50', sup: '0.8ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda Puntual (Vel: 3.50 cm/s | Dem: 0.15s | 3 Rep)' },
  "Tecno Spark 20": { gen: '190', rojo: '185', x2: '180', x4: '175', awm: '50', c360: '80', dpi: '460', boton: '52', sup: '0.8ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda Puntual (Vel: 2.80 cm/s | Dem: 0.20s | 3 Rep)' },
  "Tecno Spark 20 Pro": { gen: '194', rojo: '190', x2: '185', x4: '180', awm: '50', c360: '80', dpi: '500', boton: '48', sup: '0.6ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda Puntual (Vel: 6.50 cm/s | Dem: 0.10s | 5 Rep)' },
  "Tecno Spark 20 Pro+": { gen: '195', rojo: '192', x2: '188', x4: '182', awm: '50', c360: '80', dpi: '520', boton: '46', sup: '0.5ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda Puntual (Vel: 11.0 cm/s | Dem: 0.08s | 6 Rep)' },
  "Tecno Spark 30 (2026)": { gen: '198', rojo: '195', x2: '190', x4: '185', awm: '50', c360: '80', dpi: '550', boton: '44', sup: '0.4ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda Puntual (Vel: 15.5 cm/s | Dem: 0.05s | 8 Rep)' },
  "Tecno Pova 5": { gen: '192', rojo: '188', x2: '182', x4: '178', awm: '50', c360: '80', dpi: '500', boton: '50', sup: '0.7ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda Puntual (Vel: 7.00 cm/s | Dem: 0.10s | 5 Rep)' },
  "Tecno Pova 5 Pro": { gen: '195', rojo: '192', x2: '188', x4: '184', awm: '50', c360: '80', dpi: '550', boton: '46', sup: '0.5ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda Puntual (Vel: 12.5 cm/s | Dem: 0.08s | 6 Rep)' },
  "Tecno Pova 6": { gen: '196', rojo: '192', x2: '188', x4: '184', awm: '50', c360: '80', dpi: '580', boton: '45', sup: '0.5ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda Puntual (Vel: 16.0 cm/s | Dem: 0.05s | 8 Rep)' },
  "Tecno Pova 6 Pro": { gen: '198', rojo: '195', x2: '190', x4: '186', awm: '50', c360: '80', dpi: '600', boton: '43', sup: '0.3ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda Puntual (Vel: 22.0 cm/s | Dem: 0.02s | 10 Rep)' },
  "Tecno Pova 6 Neo": { gen: '195', rojo: '190', x2: '185', x4: '180', awm: '50', c360: '80', dpi: '550', boton: '46', sup: '0.6ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda Puntual (Vel: 10.0 cm/s | Dem: 0.08s | 5 Rep)' },
  "Tecno Camon 20": { gen: '192', rojo: '188', x2: '182', x4: '178', awm: '50', c360: '80', dpi: '480', boton: '48', sup: '0.8ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda Puntual (Vel: 4.50 cm/s | Dem: 0.15s | 4 Rep)' },
  "Tecno Camon 20 Pro": { gen: '195', rojo: '190', x2: '185', x4: '180', awm: '50', c360: '80', dpi: '520', boton: '46', sup: '0.6ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda Puntual (Vel: 9.50 cm/s | Dem: 0.10s | 5 Rep)' },
  "Tecno Camon 20 Premier": { gen: '196', rojo: '194', x2: '188', x4: '182', awm: '50', c360: '80', dpi: '550', boton: '44', sup: '0.4ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda Puntual (Vel: 14.0 cm/s | Dem: 0.05s | 8 Rep)' },
  "Tecno Spark 30 (2026)": { gen: '198', rojo: '195', x2: '190', x4: '185', awm: '50', c360: '80', dpi: '550', boton: '44', sup: '0.4ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda Puntual (Vel: 15.5 cm/s | Dem: 0.05s | 8 Rep)', modoSports: 'Activado' },
  "Tecno Camon 30": { gen: '196', rojo: '192', x2: '188', x4: '182', awm: '50', c360: '80', dpi: '550', boton: '45', sup: '0.5ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda Puntual (Vel: 18.5 cm/s | Dem: 0.02s | 8 Rep)', modoSports: 'Activado' },
  "Tecno Camon 30 Pro": { gen: '198', rojo: '195', x2: '190', x4: '185', awm: '50', c360: '80', dpi: '600', boton: '43', sup: '0.3ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda Puntual (Vel: 26.0 cm/s | Dem: 0.01s | 10 Rep)', modoSports: 'Activado' },
  "Tecno Camon 30 Premier": { gen: '200', rojo: '198', x2: '194', x4: '188', awm: '50', c360: '80', dpi: '650', boton: '42', sup: '0.2ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda Puntual (Vel: 32.5 cm/s | Dem: 0.00s | 15 Rep)', modoSports: 'Activado' },
  "Tecno Camon 40 4G": { gen: '195', rojo: '192', x2: '163', x4: '182', awm: '50', c360: '80', dpi: '500', boton: '44', sup: '0.7ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda Puntual (Vel: 0.90 cm/s | Dem: 0.70s | 2 Rep)', modoSports: 'Activado (Modo Competitivo)' },
  "Tecno Camon 40 Pro (2026)": { gen: '200', rojo: '200', x2: '198', x4: '195', awm: '60', c360: '90', dpi: '700', boton: '40', sup: 'Desactivado', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda Puntual (Vel: 40.0 cm/s | Dem: 0.00s | Infinity)' },
  "Tecno Camon 40 Premier (2026)": { gen: '200', rojo: '200', x2: '200', x4: '198', awm: '50', c360: '80', dpi: '720', boton: '38', sup: 'Desactivado', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda Puntual (Vel: 52.0 cm/s | Dem: 0.00s | Infinity)' },
  "Genérica Tecno": { gen: '192', rojo: '188', x2: '182', x4: '178', awm: '50', c360: '80', dpi: '500', boton: '48', sup: '0.6ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda Puntual (Vel: 8.50 cm/s | Dem: 0.10s | 5 Rep)' },
  "Infinix Hot 20": { gen: '188', rojo: '182', x2: '178', x4: '172', awm: '50', c360: '80', dpi: '450', boton: '55', sup: '0.8ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda Puntual (Vel: 2.50 cm/s | Dem: 0.20s | 3 Rep)' },
  "Infinix Hot 20S": { gen: '190', rojo: '185', x2: '180', x4: '175', awm: '50', c360: '80', dpi: '480', boton: '50', sup: '0.8ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda Puntual (Vel: 3.50 cm/s | Dem: 0.15s | 4 Rep)' },
  "Infinix Note 20": { gen: '192', rojo: '188', x2: '182', x4: '178', awm: '50', c360: '80', dpi: '500', boton: '48', sup: '0.7ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda Puntual (Vel: 5.00 cm/s | Dem: 0.10s | 5 Rep)' },
  "Infinix Note 20 Pro": { gen: '194', rojo: '190', x2: '185', x4: '180', awm: '50', c360: '80', dpi: '520', boton: '46', sup: '0.6ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda Puntual (Vel: 8.50 cm/s | Dem: 0.08s | 6 Rep)' },
  "Infinix Zero 20": { gen: '196', rojo: '192', x2: '188', x4: '182', awm: '50', c360: '80', dpi: '550', boton: '45', sup: '0.5ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda Puntual (Vel: 12.0 cm/s | Dem: 0.05s | 8 Rep)' },
  "Infinix Zero Ultra": { gen: '198', rojo: '196', x2: '192', x4: '188', awm: '50', c360: '80', dpi: '600', boton: '43', sup: '0.3ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda Puntual (Vel: 18.5 cm/s | Dem: 0.02s | 10 Rep)' },
  "Infinix Hot 30": { gen: '190', rojo: '185', x2: '180', x4: '175', awm: '50', c360: '80', dpi: '460', boton: '52', sup: '0.8ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda Puntual (Vel: 3.00 cm/s | Dem: 0.20s | 3 Rep)' },
  "Infinix Hot 40": { gen: '192', rojo: '188', x2: '182', x4: '178', awm: '50', c360: '80', dpi: '480', boton: '50', sup: '0.7ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda Puntual (Vel: 5.50 cm/s | Dem: 0.15s | 4 Rep)' },
  "Infinix Hot 40 Pro": { gen: '195', rojo: '192', x2: '188', x4: '182', awm: '50', c360: '80', dpi: '520', boton: '46', sup: '0.5ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda Puntual (Vel: 10.5 cm/s | Dem: 0.08s | 6 Rep)' },
  "Infinix Hot 50 (2026)": { gen: '198', rojo: '195', x2: '190', x4: '185', awm: '50', c360: '80', dpi: '550', boton: '44', sup: '0.4ms', velPuntero: 'Al máximo', accesibilidad: 'Escaneo Auto (Vel: 0.30s | Dem: 0.20s | 4 Rep)' },
  "Infinix Note 30": { gen: '192', rojo: '188', x2: '182', x4: '178', awm: '50', c360: '80', dpi: '480', boton: '48', sup: '0.8ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda Puntual (Vel: 4.50 cm/s | Dem: 0.15s | 4 Rep)' },
  "Infinix Note 30 Pro": { gen: '195', rojo: '190', x2: '185', x4: '180', awm: '50', c360: '80', dpi: '520', boton: '45', sup: '0.6ms', velPuntero: 'Al máximo', accesibilidad: 'Escaneo Auto (Vel: 0.40s | Dem: 0.30s | 3 Rep)' },
  "Infinix Note 30 VIP": { gen: '196', rojo: '194', x2: '188', x4: '184', awm: '50', c360: '80', dpi: '550', boton: '44', sup: '0.4ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda Puntual (Vel: 18.5 cm/s | Dem: 0.02s | 8 Rep)' },
  "Infinix Note 40": { gen: '195', rojo: '190', x2: '185', x4: '180', awm: '50', c360: '80', dpi: '520', boton: '46', sup: '0.6ms', velPuntero: 'Al máximo', accesibilidad: 'Escaneo Auto (Vel: 0.30s | Dem: 0.20s | 3 Rep)' },
  "Infinix Note 40 Pro": { gen: '198', rojo: '195', x2: '190', x4: '185', awm: '50', c360: '80', dpi: '580', boton: '43', sup: '0.4ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda Puntual (Vel: 24.5 cm/s | Dem: 0.01s | 10 Rep)' },
  "Infinix Note 40 Pro+": { gen: '200', rojo: '196', x2: '192', x4: '188', awm: '50', c360: '80', dpi: '600', boton: '42', sup: '0.2ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda Puntual (Vel: 33.0 cm/s | Dem: 0.00s | 15 Rep)' },
  "Infinix Note 50 VIP (2026)": { gen: '200', rojo: '200', x2: '196', x4: '192', awm: '50', c360: '80', dpi: '650', boton: '40', sup: 'Desactivado', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda Puntual (Vel: 45.0 cm/s | Dem: 0.00s | Infinity)' },
  "Infinix GT 10 Pro": { gen: '198', rojo: '195', x2: '190', x4: '185', awm: '50', c360: '80', dpi: '600', boton: '43', sup: '0.3ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda Puntual (Vel: 28.0 cm/s | Dem: 0.00s | 12 Rep)' },
  "Infinix GT 20 Pro": { gen: '200', rojo: '198', x2: '194', x4: '190', awm: '50', c360: '80', dpi: '650', boton: '40', sup: '0.2ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda Puntual (Vel: 42.0 cm/s | Dem: 0.00s | Infinity)' },
  "Genérica Infinix": { gen: '192', rojo: '188', x2: '182', x4: '178', awm: '50', c360: '80', dpi: '500', boton: '48', sup: '0.6ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda Puntual (Vel: 9.00 cm/s | Dem: 0.10s | 5 Rep)' },
  "Moto G60": { gen: '190', rojo: '185', x2: '180', x4: '175', awm: '50', c360: '80', dpi: '450', boton: '55', sup: '1.0ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda Puntual (Vel: 6.00 cm/s | Dem: 0.15s | 4 Rep)' },
  "Moto G200": { gen: '195', rojo: '190', x2: '185', x4: '180', awm: '50', c360: '80', dpi: '550', boton: '48', sup: '0.6ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda Puntual (Vel: 22.0 cm/s | Dem: 0.02s | 8 Rep)' },
  "Edge 30": { gen: '194', rojo: '188', x2: '182', x4: '178', awm: '50', c360: '80', dpi: '500', boton: '48', sup: '0.6ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda Puntual (Vel: 18.0 cm/s | Dem: 0.05s | 6 Rep)' },
  "Edge 30 Pro": { gen: '196', rojo: '192', x2: '188', x4: '182', awm: '50', c360: '80', dpi: '550', boton: '45', sup: '0.5ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda Puntual (Vel: 26.5 cm/s | Dem: 0.01s | 10 Rep)' },
  "Edge 30 Ultra": { gen: '198', rojo: '195', x2: '190', x4: '185', awm: '50', c360: '80', dpi: '600', boton: '43', sup: '0.3ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda Puntual (Vel: 36.0 cm/s | Dem: 0.00s | 15 Rep)' },
  "Edge 40": { gen: '196', rojo: '192', x2: '188', x4: '184', awm: '50', c360: '80', dpi: '580', boton: '45', sup: '0.4ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda Puntual (Vel: 24.0 cm/s | Dem: 0.02s | 8 Rep)' },
  "Edge 40 Neo": { gen: '195', rojo: '190', x2: '185', x4: '180', awm: '50', c360: '80', dpi: '550', boton: '46', sup: '0.5ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda Puntual (Vel: 16.5 cm/s | Dem: 0.05s | 6 Rep)' },
  "Edge 40 Pro": { gen: '198', rojo: '195', x2: '190', x4: '186', awm: '50', c360: '80', dpi: '620', boton: '42', sup: '0.2ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda Puntual (Vel: 45.0 cm/s | Dem: 0.00s | Infinity)' },
  "Edge 50 Pro": { gen: '200', rojo: '196', x2: '192', x4: '188', awm: '50', c360: '80', dpi: '650', boton: '42', sup: '0.2ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda Puntual (Vel: 50.0 cm/s | Dem: 0.00s | Infinity)' },
  "Edge 50 Ultra": { gen: '200', rojo: '200', x2: '196', x4: '192', awm: '50', c360: '80', dpi: '680', boton: '40', sup: 'Desactivado', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda Puntual (Vel: 65.0 cm/s | Dem: 0.00s | Infinity)' },
  "Edge 60 Pro (2026)": { gen: '200', rojo: '200', x2: '200', x4: '195', awm: '50', c360: '80', dpi: '700', boton: '38', sup: 'Desactivado', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda Puntual (Vel: 85.0 cm/s | Dem: 0.00s | Infinity)' },
  "Genérica Motorola": { gen: '192', rojo: '188', x2: '182', x4: '178', awm: '50', c360: '80', dpi: '500', boton: '48', sup: '0.6ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda Puntual (Vel: 12.0 cm/s | Dem: 0.08s | 5 Rep)' },
  "Huawei P50": { gen: '192', rojo: '188', x2: '182', x4: '178', awm: '50', c360: '80', dpi: '500', boton: '50', sup: '0.8ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda Puntual (Vel: 10.5 cm/s | Dem: 0.10s | 5 Rep)' },
  "Huawei P50 Pro": { gen: '196', rojo: '192', x2: '188', x4: '182', awm: '50', c360: '80', dpi: '580', boton: '46', sup: '0.5ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda Puntual (Vel: 20.0 cm/s | Dem: 0.02s | 8 Rep)' },
  "Huawei P60": { gen: '196', rojo: '194', x2: '188', x4: '184', awm: '50', c360: '80', dpi: '580', boton: '45', sup: '0.4ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda Puntual (Vel: 24.5 cm/s | Dem: 0.01s | 10 Rep)' },
  "Huawei P60 Pro": { gen: '198', rojo: '196', x2: '192', x4: '188', awm: '50', c360: '80', dpi: '620', boton: '43', sup: '0.2ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda Puntual (Vel: 32.0 cm/s | Dem: 0.00s | 15 Rep)' },
  "Huawei P70": { gen: '198', rojo: '196', x2: '192', x4: '188', awm: '50', c360: '80', dpi: '600', boton: '44', sup: '0.3ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda Puntual (Vel: 38.0 cm/s | Dem: 0.00s | 15 Rep)' },
  "Huawei P70 Pro": { gen: '200', rojo: '198', x2: '196', x4: '192', awm: '50', c360: '80', dpi: '650', boton: '40', sup: 'Desactivado', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda Puntual (Vel: 50.0 cm/s | Dem: 0.00s | Infinity)' },
  "Huawei Mate 50 Pro": { gen: '198', rojo: '194', x2: '190', x4: '186', awm: '50', c360: '80', dpi: '600', boton: '44', sup: '0.4ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda Puntual (Vel: 28.5 cm/s | Dem: 0.01s | 12 Rep)' },
  "Huawei Mate 60 Pro": { gen: '200', rojo: '196', x2: '194', x4: '190', awm: '50', c360: '80', dpi: '650', boton: '42', sup: '0.2ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda Puntual (Vel: 45.0 cm/s | Dem: 0.00s | Infinity)' },
  "Genérica Huawei": { gen: '194', rojo: '190', x2: '185', x4: '180', awm: '50', c360: '80', dpi: '520', boton: '46', sup: '0.5ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda Puntual (Vel: 12.0 cm/s | Dem: 0.08s | 5 Rep)' },
  "Honor 70": { gen: '194', rojo: '188', x2: '182', x4: '178', awm: '50', c360: '80', dpi: '500', boton: '48', sup: '0.6ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda Puntual (Vel: 15.0 cm/s | Dem: 0.05s | 6 Rep)' },
  "Honor 90 Lite": { gen: '192', rojo: '186', x2: '180', x4: '176', awm: '50', c360: '80', dpi: '480', boton: '50', sup: '0.8ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda Puntual (Vel: 8.50 cm/s | Dem: 0.10s | 4 Rep)' },
  "Honor 90": { gen: '196', rojo: '192', x2: '188', x4: '182', awm: '50', c360: '80', dpi: '550', boton: '45', sup: '0.5ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda Puntual (Vel: 22.5 cm/s | Dem: 0.02s | 8 Rep)' },
  "Honor 100": { gen: '196', rojo: '194', x2: '188', x4: '184', awm: '50', c360: '80', dpi: '580', boton: '44', sup: '0.4ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda Puntual (Vel: 25.0 cm/s | Dem: 0.01s | 10 Rep)' },
  "Honor 100 Pro": { gen: '198', rojo: '196', x2: '192', x4: '188', awm: '50', c360: '80', dpi: '620', boton: '42', sup: '0.2ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda Puntual (Vel: 35.0 cm/s | Dem: 0.00s | 15 Rep)' },
  "Honor 200": { gen: '198', rojo: '195', x2: '190', x4: '186', awm: '50', c360: '80', dpi: '600', boton: '43', sup: '0.3ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda Puntual (Vel: 30.0 cm/s | Dem: 0.00s | 12 Rep)' },
  "Honor 200 Pro": { gen: '200', rojo: '198', x2: '194', x4: '190', awm: '50', c360: '80', dpi: '650', boton: '40', sup: '0.1ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda Puntual (Vel: 48.0 cm/s | Dem: 0.00s | Infinity)' },
  "Honor 110 Pro": { gen: '200', rojo: '200', x2: '196', x4: '192', awm: '50', c360: '80', dpi: '680', boton: '40', sup: 'Desactivado', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda Puntual (Vel: 60.0 cm/s | Dem: 0.00s | Infinity)' },
  "Honor 120 Ultra (2026)": { gen: '200', rojo: '200', x2: '200', x4: '198', awm: '50', c360: '80', dpi: '720', boton: '38', sup: 'Desactivado', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda Puntual (Vel: 85.0 cm/s | Dem: 0.00s | Infinity)' },
  "Honor Magic 5 Pro": { gen: '198', rojo: '196', x2: '192', x4: '188', awm: '50', c360: '80', dpi: '650', boton: '42', sup: '0.2ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda Puntual (Vel: 38.0 cm/s | Dem: 0.00s | 15 Rep)' },
  "Honor Magic 6 Pro": { gen: '200', rojo: '200', x2: '196', x4: '192', awm: '50', c360: '80', dpi: '700', boton: '40', sup: 'Desactivado', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda Puntual (Vel: 55.0 cm/s | Dem: 0.00s | Infinity)' },
  "Genérica Honor": { gen: '194', rojo: '190', x2: '185', x4: '180', awm: '50', c360: '80', dpi: '520', boton: '46', sup: '0.5ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda Puntual (Vel: 14.0 cm/s | Dem: 0.05s | 6 Rep)' },
  "iPad 9na Gen": { gen: '200', rojo: '198', x2: '196', x4: '192', awm: '60', c360: '100', dpi: 'Refinado 120', boton: '40', sup: '0.08s', velPuntero: 'Máximo' },
  "iPad 10ma Gen": { gen: '200', rojo: '200', x2: '198', x4: '195', awm: '62', c360: '100', dpi: 'Deslizante 120', boton: '38', sup: '0.05s', velPuntero: 'Máximo' },
  "iPad Pro 11\"": { gen: '200', rojo: '200', x2: '200', x4: '198', awm: '65', c360: '100', dpi: 'Deslizante 120', boton: '35', sup: '0.02s', velPuntero: 'Máximo' },
  "iPad Pro 12.9\"": { gen: '200', rojo: '200', x2: '200', x4: '200', awm: '70', c360: '100', dpi: 'Deslizante 120', boton: '33', sup: '0.01s', velPuntero: 'Máximo' },
  "Galaxy Tab S7": { gen: '198', rojo: '195', x2: '190', x4: '185', awm: '50', c360: '80', dpi: '700', boton: '45', sup: '0.3ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda Puntual (Vel: 30.0 cm/s | Dem: 0.00s | 10 Rep)' },
  "Galaxy Tab S8": { gen: '200', rojo: '198', x2: '195', x4: '190', awm: '55', c360: '90', dpi: '750', boton: '42', sup: '0.2ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda Puntual (Vel: 45.0 cm/s | Dem: 0.00s | 15 Rep)' },
  "Galaxy Tab S9": { gen: '200', rojo: '200', x2: '200', x4: '198', awm: '65', c360: '100', dpi: '800', boton: '40', sup: 'Desactivado', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda Puntual (Vel: 60.0 cm/s | Dem: 0.00s | Infinity)' },
  "Xiaomi Pad 5": { gen: '198', rojo: '195', x2: '190', x4: '185', awm: '45', c360: '80', dpi: '680', boton: '44', sup: '0.4ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda Puntual (Vel: 28.0 cm/s | Dem: 0.01s | 12 Rep)' },
  "Xiaomi Pad 6": { gen: '200', rojo: '198', x2: '195', x4: '190', awm: '55', c360: '95', dpi: '720', boton: '42', sup: '0.2ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda Puntual (Vel: 42.0 cm/s | Dem: 0.00s | 15 Rep)' },
  "Poco Pad": { gen: '198', rojo: '196', x2: '192', x4: '188', awm: '50', c360: '85', dpi: '700', boton: '43', sup: '0.3ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda Puntual (Vel: 35.0 cm/s | Dem: 0.00s | 15 Rep)' }
};

interface ComAporte {
  id: number; modelo: string; gen: string; rojo: string; x2: string; x4: string; awm: string; c360: string;
  dpi: string; boton: string; sup: string; velPuntero?: string; accesibilidad?: string; autor: string; likes: number; dislikes: number;
}

export default function App() {
  const [modelo, setModelo] = useState<string>('');
  const [marcaActiva, setMarcaActiva] = useState<string>('');
 const [sensi, setSensi] = useState({ gen: '', rojo: '', x2: '', x4: '', awm: '', c360: '', modoSports: '' });
  const [dpi, setDpi] = useState<string>('');
  const [boton, setBoton] = useState<string>('');
  const [supresor, setSupresor] = useState<string>('');
  const [velPuntero, setVelPuntero] = useState<string>('');
  const [accesibilidad, setAccesibilidad] = useState<string>('');
  const [esApple, setEsApple] = useState<boolean>(false);
  const [tab, setTab] = useState<string>('oficial');
  
  const [configCargada, setConfigCargada] = useState<boolean>(false);
  const [configNoEncontrada, setConfigNoEncontrada] = useState<boolean>(false);
  const [mostrarTutorial, setMostrarTutorial] = useState<boolean>(false);

  // MODO IA - AUTO GENERADOR
  const [sensiAuto, setSensiAuto] = useState<any>(null);
  const [nivelCalibracion, setNivelCalibracion] = useState(1);

  const [comunidadDatos, setComunidadDatos] = useState<ComAporte[]>([]);
  const [busquedaComunidad, setBusquedaComunidad] = useState<string>('');
  const [userVotes, setUserVotes] = useState<Record<number, 'like' | 'dislike'>>({});
  const [mostrarFormulario, setMostrarFormulario] = useState<boolean>(false);
  const [favoritos, setFavoritos] = useState<string[]>([]);
  const [filtroCom, setFiltroCom] = useState<'top' | 'reciente'>('top');
  
  const [form, setForm] = useState({
    autor: '', marca: 'Samsung', modelo: '', gen: '', rojo: '', x2: '', x4: '', awm: '', c360: '',
    dpi: '', boton: '', supresor: '', velPuntero: '', accesibilidad: '', tipoApple: 'Refinado', dpiValor: ''
  });

  const [toastMsg, setToastMsg] = useState<string>('');
  const opacityAnim = useRef(new Animated.Value(0)).current;

  const showToast = (msg: string) => {
    setToastMsg(msg);
    Animated.sequence([
      Animated.timing(opacityAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.delay(2000),
      Animated.timing(opacityAnim, { toValue: 0, duration: 300, useNativeDriver: true })
    ]).start(() => setToastMsg(''));
  };

  useEffect(() => {
    const fetchAportes = async () => {
      const { data } = await supabase.from('comunidad').select('*').order('created_at', { ascending: false });
      if (data) setComunidadDatos(data as ComAporte[]);
    };
    fetchAportes();

    const loadMemory = async () => {
      try {
        const favs = await AsyncStorage.getItem('@favs');
        if (favs) setFavoritos(JSON.parse(favs));
        const votes = await AsyncStorage.getItem('@votes');
        if (votes) setUserVotes(JSON.parse(votes));
        const savedAutor = await AsyncStorage.getItem('@autor');
        if (savedAutor) setForm(f => ({ ...f, autor: savedAutor }));
      } catch (e) {}
    };
    loadMemory();
  }, []);

  useEffect(() => { AsyncStorage.setItem('@favs', JSON.stringify(favoritos)); }, [favoritos]);
  useEffect(() => { AsyncStorage.setItem('@votes', JSON.stringify(userVotes)); }, [userVotes]);

  const buscarConfiguracion = (nombre: string) => {
    const term = nombre.trim();
    if (!term) return;
    const isAppleDevice = term.toLowerCase().includes('apple') || term.toLowerCase().includes('iphone') || term.toLowerCase().includes('ipad');
    setEsApple(isAppleDevice);
    setMostrarTutorial(false);
    setSensiAuto(null);
    setNivelCalibracion(1);
    
    const keyMatch = Object.keys(DB_CONFIGS).find(k => k.toLowerCase() === term.toLowerCase());
    const config = keyMatch ? DB_CONFIGS[keyMatch] : null;

    if (config) {
      setSensi({ 
        gen: config.gen, 
        rojo: config.rojo, 
        x2: config.x2, 
        x4: config.x4, 
        awm: config.awm || '50', 
        c360: config.c360 || '100',
        modoSports: config.modoSports || 'Desactivado'
      });
      setDpi(config.dpi);
      setBoton(config.boton);
      setSupresor(config.sup);
      setVelPuntero(config.velPuntero || (isAppleDevice ? 'Máximo' : 'Al máximo'));
      setAccesibilidad(config.accesibilidad || (isAppleDevice ? 'N/A' : 'Desactivado'));
      setConfigCargada(true); setConfigNoEncontrada(false); setModelo(keyMatch || term);
    } else {
      setConfigCargada(false); setConfigNoEncontrada(true); setModelo(term);
    }
  };

  // ALGORITMO AUTO-GENERADOR IA
  const generarSensiIA = (nombreMod: string, nivel: number) => {
    const isAppleD = nombreMod.toLowerCase().includes('iphone') || nombreMod.toLowerCase().includes('ipad');
    
    let g = Math.min(200, 160 + (nivel * 8) + (isAppleD ? 15 : 0));
    let r = Math.min(200, g - 2);
    let d = isAppleD ? (nivel === 1 ? 'Refinado 115' : 'Deslizante 120') : (400 + (nivel * 60)).toString();
    let b = Math.max(35, 52 - (nivel * 2)).toString();
    let s = isAppleD ? '0.08s' : (nivel > 3 ? '0.2ms' : '0.6ms');
    let v = isAppleD ? 'Máximo' : 'Al máximo';
    let acc = isAppleD ? 'N/A' : `B. Puntual (Vel: ${(0.8 + nivel * 0.4).toFixed(2)} cm/s | Dem: 0.1s | ${2 + nivel} Rep)`;

    setSensiAuto({
      gen: g.toString(), rojo: r.toString(), x2: Math.min(200, g - 5).toString(), x4: Math.min(200, g - 8).toString(),
      awm: Math.min(100, 30 + (nivel * 10)).toString(), c360: Math.min(100, 50 + (nivel * 10)).toString(),
      dpi: d, boton: b, sup: s, velPuntero: v, accesibilidad: acc
    });
    setNivelCalibracion(nivel);
    setEsApple(isAppleD);
  };

  const seleccionarMarca = (marca: string) => {
    setMarcaActiva(marcaActiva === marca ? '' : marca);
    setConfigCargada(false); setConfigNoEncontrada(false); setModelo(''); setSensiAuto(null);
  };

  const guardarAporte = async () => {
    if (!form.autor || !form.modelo || !form.gen) { showToast("Llena los campos"); return; }
    const isAppleDevice = form.marca === 'Apple' || form.marca === 'Tablets'; 
    const nuevoAporte = {
      modelo: `${form.marca} ${form.modelo}`,
      gen: form.gen, rojo: form.rojo || form.gen, x2: form.x2 || '190', x4: form.x4 || '185',
      awm: form.awm || '50', c360: form.c360 || '100',
      dpi: isAppleDevice ? `${form.tipoApple} ${form.dpiValor}` : (form.dpi || '500'),
      boton: form.boton, sup: form.supresor || '0.5ms',
      "velPuntero": isAppleDevice ? 'N/A' : (form.velPuntero || 'Al máximo'),
      accesibilidad: isAppleDevice ? 'N/A' : (form.accesibilidad || 'Desactivado'),
      autor: form.autor
    };

    const { data } = await supabase.from('comunidad').insert([nuevoAporte]).select();
    if (data) {
      AsyncStorage.setItem('@autor', form.autor);
      setComunidadDatos([data[0] as ComAporte, ...comunidadDatos]);
      setMostrarFormulario(false);
      showToast("¡Aporte compartido!");
    } else {
      showToast("Error en base de datos");
    }
  };

  const toggleFav = (idItem: string) => {
    setFavoritos(prev => {
      if (prev.includes(idItem)) { showToast("Quitado de Favoritos"); return prev.filter(i => i !== idItem); }
      showToast("⭐ ¡Favorito!"); return [...prev, idItem];
    });
  };

  return (
    <View style={styles.container}>
      {toastMsg !== '' && (
        <Animated.View style={[styles.toast, { opacity: opacityAnim }]}>
          <Text style={styles.toastText}>{toastMsg}</Text>
        </Animated.View>
      )}

      <View style={styles.header}><Image source={SensiLogo} style={styles.logo} /><Text style={styles.title}>SENSIBILIDAFF</Text></View>
      
      <View style={styles.tabContainer}>
        <TouchableOpacity style={[styles.tab, tab === 'oficial' && styles.tabActive]} onPress={() => setTab('oficial')}><Text style={[styles.tabText, tab === 'oficial' && styles.tabTextActive]}>OFICIAL</Text></TouchableOpacity>
        <TouchableOpacity style={[styles.tab, tab === 'comunidad' && styles.tabActive]} onPress={() => setTab('comunidad')}><Text style={[styles.tabText, tab === 'comunidad' && styles.tabTextActive]}>COMUNIDAD</Text></TouchableOpacity>
        <TouchableOpacity style={[styles.tab, tab === 'favs' && styles.tabActive]} onPress={() => setTab('favs')}><Text style={[styles.tabText, tab === 'favs' && styles.tabTextActive]}>FAVS ⭐</Text></TouchableOpacity>
      </View>

      <View style={styles.contentContainer}>
        {tab === 'oficial' ? (
          <ScrollView style={{ width: '100%' }} contentContainerStyle={{ alignItems: 'center', paddingBottom: 100 }}>
            <View style={styles.marcasWrapper}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.marcasContainer}>
                {MARCAS.map((m) => (
                  <TouchableOpacity key={m} style={[styles.marcaBtn, marcaActiva === m && styles.marcaBtnActiva]} onPress={() => seleccionarMarca(m)}>
                    <Text style={[styles.marcaText, marcaActiva === m && styles.marcaTextActiva]}>{m}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {marcaActiva === '' ? (
              <TextInput style={styles.input} placeholder="Busca tu modelo..." placeholderTextColor="#666" value={modelo} onChangeText={(t) => { setModelo(t); buscarConfiguracion(t); }} />
            ) : (
              <View style={styles.dropdown}>
                <ScrollView nestedScrollEnabled={true} style={{ maxHeight: 180 }}>
                  {MODELOS_POR_MARCA[marcaActiva]?.map((mod) => (
                    <TouchableOpacity key={mod} style={styles.dropItem} onPress={() => buscarConfiguracion(mod)}><Text style={styles.dropText}>{mod}</Text></TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            {configCargada && !sensiAuto && (
              <View style={styles.card}>
                <View style={styles.comHeader}>
                  <Text style={styles.label}>✔ OFICIAL: {modelo.toUpperCase()}</Text>
                  <TouchableOpacity onPress={() => toggleFav(modelo)}><Text style={{fontSize: 22}}>{favoritos.includes(modelo) ? '⭐' : '☆'}</Text></TouchableOpacity>
                </View>
                <View style={styles.row}>
                  <View><Text style={styles.text}>General: <Text style={styles.val}>{sensi.gen}</Text></Text><Text style={styles.text}>Mira x2: <Text style={styles.val}>{sensi.x2}</Text></Text><Text style={styles.text}>AWM: <Text style={styles.val}>{sensi.awm}</Text></Text></View>
                  <View><Text style={styles.text}>Rojo: <Text style={styles.val}>{sensi.rojo}</Text></Text><Text style={styles.text}>Mira x4: <Text style={styles.val}>{sensi.x4}</Text></Text><Text style={styles.text}>Cám 360: <Text style={styles.val}>{sensi.c360}</Text></Text></View>
                </View>
                <View style={styles.divider} />
                <Text style={styles.text}>{esApple ? 'Ajuste Interno' : 'DPI'}: <Text style={styles.val}>{dpi}</Text></Text>
                <Text style={styles.text}>Botón de Disparo: <Text style={styles.val}>{boton}%</Text></Text>
                <Text style={styles.text}>{esApple ? 'Control Botón (Sup)' : 'Supresor'}: <Text style={styles.val}>{supresor}</Text></Text>
                <Text style={styles.text}>{esApple ? 'Vel. Desplazamiento' : 'Vel. Puntero'}: <Text style={styles.val}>{velPuntero}</Text></Text>
                {!esApple && <Text style={styles.text}>Interruptores: <Text style={styles.val}>{accesibilidad}</Text></Text>}
                {sensi.modoSports !== 'Desactivado' && sensi.modoSports !== '' && (
                <Text style={styles.text}>Modo Sports: <Text style={styles.val}>{sensi.modoSports}</Text></Text>
                )}

                <View style={styles.row}>
                  <TouchableOpacity style={[styles.btnCopiar, {flex: 1, marginRight: 5, backgroundColor: '#222'}]} onPress={() => setMostrarTutorial(!mostrarTutorial)}><Text style={styles.btnText}>📖 ¿CÓMO APLICAR?</Text></TouchableOpacity>
                  <TouchableOpacity style={[styles.btnCopiar, {flex: 1, marginLeft: 5}]} onPress={() => { Clipboard.setString(`Config: ${sensi.gen} | DPI: ${dpi}`); showToast("Copiado"); }}><Text style={styles.btnText}>COPIAR</Text></TouchableOpacity>
                </View>

                {mostrarTutorial && (
                  <View style={styles.tutorialBox}>
                    <Text style={styles.tutorialTitle}>RUTAS DE CONFIGURACIÓN:</Text>
                    {esApple ? (
                      <>
                        <Text style={styles.tutorialStep}>1. Ajuste Interno: Ajustes {'>'} Accesibilidad {'>'} Pantalla y tamaño de texto.</Text>
                        <Text style={styles.tutorialStep}>2. Control Botón: Ajustes {'>'} Accesibilidad {'>'} Tocar {'>'} AssistiveTouch {'>'} Teclas para mouse.</Text>
                        <Text style={styles.tutorialStep}>3. Vel. Desplazamiento: Ajustes {'>'} Accesibilidad {'>'} Control del Puntero.</Text>
                      </>
                    ) : (
                      <>
                        <Text style={styles.tutorialStep}>1. DPI: Ajustes {'>'} Opciones de desarrollador {'>'} Ancho mínimo.</Text>
                        <Text style={styles.tutorialStep}>2. Vel. Puntero: Ajustes {'>'} Sistema {'>'} Idioma y entrada {'>'} Velocidad del puntero.</Text>
                        <Text style={styles.tutorialStep}>3. Interruptores: Ajustes {'>'} Accesibilidad {'>'} Accesibilidad con interruptores.</Text>
                      </>
                    )}
                  </View>
                )}
              </View>
            )}

            {configNoEncontrada && !sensiAuto && (
              <View style={styles.iaBox}>
                <Text style={styles.iaTitle}>🤖 MODO IA: AUTO-GENERADOR</Text>
                <Text style={styles.iaText}>No tenemos datos oficiales para <Text style={{color:'#FFF', fontWeight: 'bold'}}>{modelo}</Text>.</Text>
                <Text style={styles.iaText}>¿Quieres que nuestro algoritmo calcule una sensibilidad perfecta basada en tu sistema operativo?</Text>
                <TouchableOpacity style={styles.btnIa} onPress={() => generarSensiIA(modelo, 1)}><Text style={styles.btnText}>✨ GENERAR SENSI CON IA</Text></TouchableOpacity>
              </View>
            )}

            {sensiAuto && (
              <View style={[styles.card, {borderColor: '#00F0FF'}]}>
                <View style={styles.comHeader}>
                  <Text style={[styles.label, {color: '#00F0FF'}]}>✨ IA: {modelo.toUpperCase()}</Text>
                  <Text style={{color: '#00F0FF', fontSize: 10, fontWeight: 'bold'}}>Nivel {nivelCalibracion}</Text>
                </View>
                <View style={styles.row}>
                  <View><Text style={styles.text}>General: <Text style={styles.val}>{sensiAuto.gen}</Text></Text><Text style={styles.text}>Mira x2: <Text style={styles.val}>{sensiAuto.x2}</Text></Text><Text style={styles.text}>AWM: <Text style={styles.val}>{sensiAuto.awm}</Text></Text></View>
                  <View><Text style={styles.text}>Rojo: <Text style={styles.val}>{sensiAuto.rojo}</Text></Text><Text style={styles.text}>Mira x4: <Text style={styles.val}>{sensiAuto.x4}</Text></Text><Text style={styles.text}>Cám 360: <Text style={styles.val}>{sensiAuto.c360}</Text></Text></View>
                </View>
                <View style={styles.divider} />
                <Text style={styles.text}>{esApple ? 'Ajuste Interno' : 'DPI'}: <Text style={styles.val}>{sensiAuto.dpi}</Text></Text>
                <Text style={styles.text}>Botón de Disparo: <Text style={styles.val}>{sensiAuto.boton}%</Text></Text>
                <Text style={styles.text}>{esApple ? 'Control Botón (Sup)' : 'Supresor'}: <Text style={styles.val}>{sensiAuto.sup}</Text></Text>
                <Text style={styles.text}>{esApple ? 'Vel. Desplazamiento' : 'Vel. Puntero'}: <Text style={styles.val}>{sensiAuto.velPuntero}</Text></Text>
                {!esApple && <Text style={styles.text}>Interruptores: <Text style={styles.val}>{sensiAuto.accesibilidad}</Text></Text>}
                
                <TouchableOpacity style={[styles.btnIa, {marginTop: 15, backgroundColor: '#00F0FF33', borderColor: '#00F0FF', borderWidth: 1}]} onPress={() => generarSensiIA(modelo, nivelCalibracion + 1)}>
                  <Text style={[styles.btnText, {color: '#00F0FF'}]}>⚙️ MEJORAR PRECISIÓN (CALIBRAR)</Text>
                </TouchableOpacity>
              </View>
            )}

          </ScrollView>
        ) : tab === 'comunidad' ? (
          <ScrollView style={styles.cardCom} contentContainerStyle={{ paddingBottom: 30 }}>
            {!mostrarFormulario ? (
              <>
                {comunidadDatos.map((item) => (
                  <View key={item.id} style={styles.comItem}>
                    <Text style={styles.comModelo}>{item.modelo}</Text>
                    <Text style={styles.comSensi}>Gen: {item.gen} | DPI: {item.dpi} | Por: {item.autor}</Text>
                    <View style={styles.dividerSmall} />
                  </View>
                ))}
                <TouchableOpacity style={styles.btnShare} onPress={() => setMostrarFormulario(true)}><Text style={styles.btnText}>COMPARTIR MI SENSI</Text></TouchableOpacity>
              </>
            ) : (
              <View>
                <TextInput style={styles.formInput} placeholder="Alias" placeholderTextColor="#666" value={form.autor} onChangeText={(t) => setForm({ ...form, autor: t })} />
                <TextInput style={styles.formInput} placeholder="Modelo Exacto" placeholderTextColor="#666" value={form.modelo} onChangeText={(t) => setForm({ ...form, modelo: t })} />
                <View style={styles.row}>
                  <TextInput style={[styles.formInput, { flex: 1, marginRight: 5 }]} placeholder="Sensi Gen" placeholderTextColor="#666" keyboardType="numeric" value={form.gen} onChangeText={(t) => setForm({ ...form, gen: t })} />
                  <TextInput style={[styles.formInput, { flex: 1, marginLeft: 5 }]} placeholder="Punto Rojo" placeholderTextColor="#666" keyboardType="numeric" value={form.rojo} onChangeText={(t) => setForm({ ...form, rojo: t })} />
                </View>
                <View style={styles.row}>
                  <TextInput style={[styles.formInput, { flex: 1, marginRight: 5 }]} placeholder="AWM" placeholderTextColor="#666" keyboardType="numeric" value={form.awm} onChangeText={(t) => setForm({ ...form, awm: t })} />
                  <TextInput style={[styles.formInput, { flex: 1, marginLeft: 5 }]} placeholder="Cámara 360" placeholderTextColor="#666" keyboardType="numeric" value={form.c360} onChangeText={(t) => setForm({ ...form, c360: t })} />
                </View>
                <TouchableOpacity style={styles.button} onPress={guardarAporte}><Text style={styles.buttonText}>GUARDAR</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => setMostrarFormulario(false)}><Text style={{color: '#666', textAlign: 'center', marginTop: 10, fontWeight: 'bold'}}>CANCELAR</Text></TouchableOpacity>
              </View>
            )}
          </ScrollView>
        ) : (
          <ScrollView style={styles.cardCom}>
            <Text style={styles.label}>FAVORITOS</Text>
            {favoritos.map(fav => <Text key={fav} style={styles.comModelo}>⭐ {fav}</Text>)}
          </ScrollView>
        )}
      </View>

      <View style={styles.footerBadge}>
        <View style={styles.neonContainer}>
          <Text style={styles.footerText}>CREADO POR <Text style={styles.footerHighlight}>BETADO</Text></Text>
          <View style={styles.glowLine} />
          <Text style={styles.footerSub}>🔥 YouTube & TikTok 🔥</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#050505', paddingTop: 50 },
  contentContainer: { flex: 1, alignItems: 'center' },
  header: { alignItems: 'center', marginBottom: 10 },
  logo: { width: 85, height: 85, borderRadius: 18 },
  title: { fontSize: 20, fontWeight: '900', color: '#FF0000', marginTop: 5, letterSpacing: 3 },
  tabContainer: { flexDirection: 'row', width: '90%', marginVertical: 10, alignSelf: 'center' },
  tab: { flex: 1, padding: 10, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: '#222' },
  tabActive: { borderBottomColor: '#FF0000' },
  tabText: { color: '#666', fontWeight: 'bold', fontSize: 13 },
  tabTextActive: { color: '#FF0000' },
  marcasWrapper: { height: 45, marginBottom: 10, width: '100%' },
  marcasContainer: { paddingHorizontal: 15, flexDirection: 'row' },
  marcaBtn: { backgroundColor: '#111', paddingVertical: 6, paddingHorizontal: 14, borderRadius: 20, marginRight: 8, borderWidth: 1, borderColor: '#333' },
  marcaBtnActiva: { backgroundColor: '#FF0000', borderColor: '#FF0000' },
  marcaText: { color: '#888', fontWeight: 'bold', fontSize: 11 },
  marcaTextActiva: { color: '#FFF' },
  input: { width: '90%', backgroundColor: '#111', color: '#FFF', padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#222' },
  dropdown: { width: '90%', backgroundColor: '#0A0A0A', borderRadius: 10, borderWidth: 1, borderColor: '#333', padding: 10 },
  dropItem: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#1A1A1A' },
  dropText: { color: '#AAA', fontSize: 13 },
  card: { width: '90%', backgroundColor: '#111', borderRadius: 20, padding: 20, marginTop: 10, borderWidth: 1, borderColor: '#FF000033' },
  comHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  label: { color: '#FF0000', fontWeight: '900', fontSize: 14 },
  text: { color: '#AAA', marginBottom: 4, fontSize: 13 },
  val: { color: '#FFF', fontWeight: 'bold' },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  divider: { height: 1, backgroundColor: '#222', marginVertical: 10 },
  dividerSmall: { height: 1, backgroundColor: '#1A1A1A', marginTop: 10 },
  btnCopiar: { backgroundColor: '#FF0000', padding: 12, borderRadius: 10, alignItems: 'center', marginTop: 15 },
  btnShare: { backgroundColor: '#FF0000', padding: 14, borderRadius: 10, alignItems: 'center', marginTop: 20 },
  btnText: { color: '#FFF', fontWeight: 'bold', fontSize: 11 },
  cardCom: { width: '90%', backgroundColor: '#111', borderRadius: 20, padding: 15, alignSelf: 'center' },
  comItem: { marginBottom: 12 },
  comModelo: { color: '#FFF', fontWeight: 'bold', fontSize: 14, marginBottom: 4 },
  comSensi: { color: '#777', fontSize: 11 },
  formInput: { backgroundColor: '#1A1A1A', color: '#FFF', padding: 12, borderRadius: 8, marginBottom: 10, borderWidth: 1, borderColor: '#333' },
  button: { backgroundColor: '#FF0000', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 5 },
  buttonText: { color: '#FFF', fontWeight: '900' },
  toast: { position: 'absolute', top: 50, left: '10%', right: '10%', zIndex: 100, backgroundColor: '#FF0000CC', padding: 10, borderRadius: 10, alignItems: 'center' },
  toastText: { color: '#FFF', fontWeight: 'bold' },
  errorText: { color: '#666', marginTop: 20 },

  // IA BOX
  iaBox: { width: '90%', backgroundColor: '#001A33', borderRadius: 15, padding: 20, marginTop: 20, borderWidth: 1, borderColor: '#00F0FF55', alignItems: 'center' },
  iaTitle: { color: '#00F0FF', fontWeight: 'bold', fontSize: 14, marginBottom: 10 },
  iaText: { color: '#AAA', fontSize: 12, textAlign: 'center', marginBottom: 10 },
  btnIa: { backgroundColor: '#00F0FF', padding: 12, borderRadius: 10, alignItems: 'center', marginTop: 5, width: '100%' },

  // TUTORIAL BOX
  tutorialBox: { backgroundColor: '#1A0000', padding: 12, borderRadius: 10, marginTop: 15, borderWidth: 1, borderColor: '#FF000055' },
  tutorialTitle: { color: '#FF0000', fontWeight: 'bold', fontSize: 12, marginBottom: 8 },
  tutorialStep: { color: '#CCC', fontSize: 11, marginBottom: 4 },

  // FOOTER BETADO
  footerBadge: { paddingVertical: 15, alignItems: 'center', backgroundColor: '#000', width: '100%', borderTopWidth: 2, borderTopColor: '#FF0000', shadowColor: "#FF0000", shadowOffset: { width: 0, height: -5 }, shadowOpacity: 0.5, shadowRadius: 10, elevation: 20 },
  neonContainer: { alignItems: 'center' },
  footerText: { color: '#FFF', fontSize: 16, fontWeight: '900', letterSpacing: 2, textTransform: 'uppercase' },
  footerHighlight: { color: '#FF0000', textShadowColor: '#FF0000', textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 15 },
  glowLine: { width: 100, height: 2, backgroundColor: '#FF0000', marginVertical: 4, borderRadius: 2, shadowColor: "#FF0000", shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 5 },
  footerSub: { color: '#AAA', fontSize: 10, fontWeight: 'bold', marginTop: 2, letterSpacing: 3 },
});