import 'react-native-url-polyfill/auto';
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, TextInput, Clipboard, Platform, Animated, Alert } from 'react-native';
import * as Device from 'expo-device';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://oksemloetsneadfjqpew.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9rc2VtbG9ldHNuZWFkZmpxcGV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxMjk4OTQsImV4cCI6MjA5MTcwNTg5NH0.DZwavTBWbk0pnpmVkMbXfezgsnYygnmbQRyFQ8AgtCU';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const SensiLogo = require('./ff_sensitivity_logo.png');

const MARCAS: string[] = ['Apple', 'Samsung', 'Xiaomi', 'Tecno', 'Infinix', 'Huawei', 'Motorola', 'Honor'];

interface Config {
  gen: string;
  rojo: string;
  x2: string;
  x4: string;
  dpi: string;
  boton: string;
  sup: string;
  velPuntero?: string;
  accesibilidad?: string;
}

const MODELOS_POR_MARCA: Record<string, string[]> = {
  'Apple': ['iPhone 11', 'iPhone 11 Pro', 'iPhone 11 Pro Max', 'iPhone 12', 'iPhone 12 Pro', 'iPhone 12 Pro Max', 'iPhone 13', 'iPhone 13 Pro', 'iPhone 13 Pro Max', 'iPhone 14', 'iPhone 14 Plus', 'iPhone 14 Pro', 'iPhone 14 Pro Max', 'iPhone 15', 'iPhone 15 Plus', 'iPhone 15 Pro', 'iPhone 15 Pro Max', 'iPhone 16', 'iPhone 16 Plus', 'iPhone 16 Pro', 'iPhone 16 Pro Max', 'iPhone 17', 'iPhone 17 Pro', 'iPhone 17 Pro Max', 'iPhone 18 Ultra (2026)', 'Genérica Apple'],
  'Samsung': ['Samsung S21 FE', 'Samsung S21', 'Samsung S21+', 'Samsung S21 Ultra', 'Samsung S22', 'Samsung S22+', 'Samsung S22 Ultra', 'Samsung S23 FE', 'Samsung S23', 'Samsung S23+', 'Samsung S23 Ultra', 'Samsung S24', 'Samsung S24+', 'Samsung S24 Ultra', 'Samsung S25', 'Samsung S25+', 'Samsung S25 Ultra', 'Samsung S26 Ultra', 'Samsung A34 5G', 'Samsung A54 5G', 'Samsung A35 5G', 'Samsung A55 5G', 'Samsung A56 (2026)', 'Genérica Samsung'],
  'Xiaomi': ['Poco X3 Pro', 'Poco X4 Pro', 'Poco X5 Pro', 'Poco X6 Pro', 'Poco F4', 'Poco F5', 'Poco F5 Pro', 'Poco F6', 'Poco F6 Pro', 'Poco F7 Pro (2026)', 'Redmi Note 12', 'Redmi Note 12 Pro', 'Redmi Note 12 Pro+', 'Redmi Note 13', 'Redmi Note 13 Pro', 'Redmi Note 13 Pro+', 'Redmi Note 14', 'Redmi Note 14 Pro', 'Redmi Note 14 Pro+', 'Redmi Note 15 Pro (2026)', 'Xiaomi 13T Pro', 'Xiaomi 14 Ultra', 'Genérica Xiaomi'],
  'Tecno': ['Tecno Spark 10 Pro', 'Tecno Spark 20', 'Tecno Spark 20 Pro', 'Tecno Spark 20 Pro+', 'Tecno Spark 30 (2026)', 'Tecno Pova 5', 'Tecno Pova 5 Pro', 'Tecno Pova 6', 'Tecno Pova 6 Pro', 'Tecno Pova 6 Neo', 'Tecno Camon 20', 'Tecno Camon 20 Pro', 'Tecno Camon 20 Premier', 'Tecno Camon 30', 'Tecno Camon 30 Pro', 'Tecno Camon 30 Premier', 'Tecno Camon 40 Pro (2026)', 'Genérica Tecno'],
  'Infinix': ['Infinix Hot 30', 'Infinix Hot 40', 'Infinix Hot 40 Pro', 'Infinix Hot 50 (2026)', 'Infinix Note 30', 'Infinix Note 30 Pro', 'Infinix Note 30 VIP', 'Infinix Note 40', 'Infinix Note 40 Pro', 'Infinix Note 40 Pro+', 'Infinix Note 50 VIP (2026)', 'Infinix GT 10 Pro', 'Infinix GT 20 Pro', 'Genérica Infinix'],
  'Motorola': ['Moto G60', 'Moto G200', 'Edge 30', 'Edge 30 Pro', 'Edge 30 Ultra', 'Edge 40', 'Edge 40 Neo', 'Edge 40 Pro', 'Edge 50 Pro', 'Edge 50 Ultra', 'Edge 60 Pro (2026)', 'Genérica Motorola'],
  'Huawei': ['Huawei P50', 'Huawei P50 Pro', 'Huawei P60', 'Huawei P60 Pro', 'Huawei P70', 'Huawei P70 Pro', 'Huawei Mate 50 Pro', 'Huawei Mate 60 Pro', 'Genérica Huawei'],
  'Honor': ['Honor 70', 'Honor 90', 'Honor 90 Lite', 'Honor 100', 'Honor 100 Pro', 'Honor 200', 'Honor 200 Pro', 'Honor 110 Pro', 'Honor 120 Ultra (2026)', 'Honor Magic 5 Pro', 'Honor Magic 6 Pro', 'Genérica Honor']
};

const DB_CONFIGS: Record<string, Config> = {
  "iPhone 11": { gen: '190', rojo: '185', x2: '180', x4: '175', dpi: 'Refinado 110', boton: '55', sup: '0.15s' },
  "iPhone 11 Pro": { gen: '192', rojo: '186', x2: '182', x4: '178', dpi: 'Refinado 110', boton: '53', sup: '0.12s' },
  "iPhone 11 Pro Max": { gen: '194', rojo: '188', x2: '185', x4: '180', dpi: 'Sencillo 115', boton: '50', sup: '0.12s' },
  "iPhone 12": { gen: '194', rojo: '188', x2: '182', x4: '178', dpi: 'Refinado 115', boton: '50', sup: '0.10s' },
  "iPhone 12 Pro": { gen: '195', rojo: '190', x2: '185', x4: '180', dpi: 'Deslizante 115', boton: '48', sup: '0.10s' },
  "iPhone 12 Pro Max": { gen: '196', rojo: '192', x2: '188', x4: '182', dpi: 'Deslizante 115', boton: '46', sup: '0.10s' },
  "iPhone 13": { gen: '195', rojo: '190', x2: '185', x4: '180', dpi: 'Refinado 115', boton: '48', sup: '0.10s' },
  "iPhone 13 Pro": { gen: '198', rojo: '192', x2: '188', x4: '182', dpi: 'Deslizante 115', boton: '46', sup: '0.08s' },
  "iPhone 13 Pro Max": { gen: '198', rojo: '194', x2: '190', x4: '185', dpi: 'Deslizante 120', boton: '44', sup: '0.08s' },
  "iPhone 14": { gen: '198', rojo: '192', x2: '188', x4: '185', dpi: 'Refinado 115', boton: '46', sup: '0.08s' },
  "iPhone 14 Plus": { gen: '198', rojo: '192', x2: '188', x4: '185', dpi: 'Refinado 115', boton: '46', sup: '0.08s' },
  "iPhone 14 Pro": { gen: '200', rojo: '195', x2: '192', x4: '188', dpi: 'Deslizante 120', boton: '44', sup: '0.05s' },
  "iPhone 14 Pro Max": { gen: '200', rojo: '198', x2: '195', x4: '190', dpi: 'Deslizante 120', boton: '43', sup: '0.05s' },
  "iPhone 15": { gen: '200', rojo: '195', x2: '190', x4: '188', dpi: 'Refinado 120', boton: '45', sup: '0.05s' },
  "iPhone 15 Plus": { gen: '200', rojo: '195', x2: '190', x4: '188', dpi: 'Refinado 120', boton: '45', sup: '0.05s' },
  "iPhone 15 Pro": { gen: '200', rojo: '198', x2: '194', x4: '190', dpi: 'Deslizante 120', boton: '43', sup: '0.05s' },
  "iPhone 15 Pro Max": { gen: '200', rojo: '200', x2: '198', x4: '195', dpi: 'Deslizante 120', boton: '42', sup: '0.05s' },
  "iPhone 16": { gen: '200', rojo: '198', x2: '194', x4: '190', dpi: 'Refinado 120', boton: '44', sup: '0.05s' },
  "iPhone 16 Plus": { gen: '200', rojo: '198', x2: '194', x4: '190', dpi: 'Refinado 120', boton: '44', sup: '0.05s' },
  "iPhone 16 Pro": { gen: '200', rojo: '200', x2: '196', x4: '192', dpi: 'Deslizante 120', boton: '42', sup: '0.05s' },
  "iPhone 16 Pro Max": { gen: '200', rojo: '200', x2: '198', x4: '195', dpi: 'Deslizante 120', boton: '40', sup: '0.05s' },
  "iPhone 17": { gen: '200', rojo: '200', x2: '196', x4: '192', dpi: 'Refinado 120', boton: '42', sup: '0.05s' },
  "iPhone 17 Pro": { gen: '200', rojo: '200', x2: '198', x4: '195', dpi: 'Deslizante 120', boton: '40', sup: '0.05s' },
  "iPhone 17 Pro Max": { gen: '200', rojo: '200', x2: '200', x4: '198', dpi: 'Deslizante 120', boton: '38', sup: '0.05s' },
  "iPhone 18 Ultra (2026)": { gen: '200', rojo: '200', x2: '200', x4: '200', dpi: 'Deslizante 120', boton: '35', sup: '0.05s' },
  "Genérica Apple": { gen: '198', rojo: '190', x2: '185', x4: '180', dpi: 'Refinado 115', boton: '50', sup: '0.10s' },
  "Samsung S21 FE": { gen: '190', rojo: '185', x2: '180', x4: '175', dpi: '550', boton: '50', sup: '0.8ms', velPuntero: 'A la mitad + 1', accesibilidad: 'Desactivado' },
  "Samsung S21": { gen: '190', rojo: '185', x2: '180', x4: '175', dpi: '560', boton: '50', sup: '0.8ms', velPuntero: 'A la mitad + 1', accesibilidad: 'Búsqueda Lineal' },
  "Samsung S21+": { gen: '192', rojo: '186', x2: '182', x4: '178', dpi: '580', boton: '48', sup: '0.6ms', velPuntero: 'A la mitad + 2', accesibilidad: 'Búsqueda Lineal' },
  "Samsung S21 Ultra": { gen: '194', rojo: '188', x2: '185', x4: '180', dpi: '600', boton: '46', sup: '0.6ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda por Punto' },
  "Samsung S22": { gen: '192', rojo: '188', x2: '182', x4: '178', dpi: '580', boton: '48', sup: '0.6ms', velPuntero: 'A la mitad + 2', accesibilidad: 'Desactivado' },
  "Samsung S22+": { gen: '194', rojo: '190', x2: '185', x4: '180', dpi: '600', boton: '46', sup: '0.5ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda Lineal' },
  "Samsung S22 Ultra": { gen: '196', rojo: '192', x2: '188', x4: '182', dpi: '620', boton: '45', sup: '0.5ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda por Punto' },
  "Samsung S23 FE": { gen: '194', rojo: '190', x2: '185', x4: '180', dpi: '600', boton: '46', sup: '0.6ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda Lineal' },
  "Samsung S23": { gen: '195', rojo: '192', x2: '188', x4: '182', dpi: '620', boton: '45', sup: '0.5ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda Lineal' },
  "Samsung S23+": { gen: '196', rojo: '194', x2: '190', x4: '185', dpi: '640', boton: '44', sup: '0.4ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda por Punto' },
  "Samsung S23 Ultra": { gen: '198', rojo: '196', x2: '192', x4: '188', dpi: '680', boton: '42', sup: '0.3ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda por Punto' },
  "Samsung S24": { gen: '198', rojo: '194', x2: '190', x4: '186', dpi: '650', boton: '44', sup: '0.3ms', velPuntero: 'Al máximo', accesibilidad: 'Desactivado' },
  "Samsung S24+": { gen: '198', rojo: '196', x2: '192', x4: '188', dpi: '680', boton: '43', sup: '0.2ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda Lineal' },
  "Samsung S24 Ultra": { gen: '200', rojo: '198', x2: '195', x4: '190', dpi: '700', boton: '40', sup: 'Desactivado', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda por Punto' },
  "Samsung S25": { gen: '200', rojo: '196', x2: '192', x4: '188', dpi: '680', boton: '42', sup: '0.2ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda Lineal' },
  "Samsung S25+": { gen: '200', rojo: '198', x2: '195', x4: '190', dpi: '700', boton: '41', sup: '0.1ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda por Punto' },
  "Samsung S25 Ultra": { gen: '200', rojo: '200', x2: '198', x4: '194', dpi: '720', boton: '40', sup: 'Desactivado', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda por Punto' },
  "Samsung S26 Ultra": { gen: '200', rojo: '200', x2: '200', x4: '198', dpi: '750', boton: '38', sup: 'Desactivado', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda por Punto' },
  "Samsung A34 5G": { gen: '190', rojo: '185', x2: '180', x4: '175', dpi: '550', boton: '50', sup: '0.8ms', velPuntero: 'A la mitad + 1', accesibilidad: 'Desactivado' },
  "Samsung A35 5G": { gen: '192', rojo: '188', x2: '182', x4: '178', dpi: '580', boton: '48', sup: '0.6ms', velPuntero: 'A la mitad + 2', accesibilidad: 'Búsqueda Lineal' },
  "Samsung A54 5G": { gen: '194', rojo: '190', x2: '185', x4: '180', dpi: '600', boton: '46', sup: '0.5ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda Lineal' },
  "Samsung A55 5G": { gen: '196', rojo: '192', x2: '188', x4: '182', dpi: '620', boton: '45', sup: '0.4ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda por Punto' },
  "Samsung A56 (2026)": { gen: '198', rojo: '195', x2: '190', x4: '185', dpi: '650', boton: '44', sup: '0.2ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda por Punto' },
  "Genérica Samsung": { gen: '190', rojo: '185', x2: '180', x4: '175', dpi: '550', boton: '48', sup: '0.6ms', velPuntero: 'A la mitad + 1', accesibilidad: 'Desactivado' },
  "Poco X3 Pro": { gen: '195', rojo: '190', x2: '185', x4: '180', dpi: '600', boton: '48', sup: '0.8ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda Lineal' },
  "Poco X4 Pro": { gen: '192', rojo: '188', x2: '182', x4: '178', dpi: '550', boton: '50', sup: '0.8ms', velPuntero: 'A la mitad + 2', accesibilidad: 'Desactivado' },
  "Poco X5 Pro": { gen: '196', rojo: '192', x2: '188', x4: '182', dpi: '620', boton: '46', sup: '0.6ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda Lineal' },
  "Poco X6 Pro": { gen: '198', rojo: '195', x2: '190', x4: '185', dpi: '650', boton: '44', sup: '0.4ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda por Punto' },
  "Poco F4": { gen: '196', rojo: '192', x2: '188', x4: '184', dpi: '620', boton: '45', sup: '0.6ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda Lineal' },
  "Poco F5": { gen: '198', rojo: '195', x2: '190', x4: '185', dpi: '650', boton: '44', sup: '0.4ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda por Punto' },
  "Poco F5 Pro": { gen: '200', rojo: '196', x2: '192', x4: '188', dpi: '680', boton: '43', sup: '0.2ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda por Punto' },
  "Poco F6": { gen: '200', rojo: '198', x2: '194', x4: '190', dpi: '680', boton: '42', sup: '0.2ms', velPuntero: 'Al máximo', accesibilidad: 'Desactivado' },
  "Poco F6 Pro": { gen: '200', rojo: '200', x2: '196', x4: '192', dpi: '700', boton: '40', sup: 'Desactivado', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda por Punto' },
  "Poco F7 Pro (2026)": { gen: '200', rojo: '200', x2: '198', x4: '195', dpi: '720', boton: '38', sup: 'Desactivado', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda por Punto' },
  "Redmi Note 12": { gen: '190', rojo: '185', x2: '180', x4: '175', dpi: '500', boton: '50', sup: '0.8ms', velPuntero: 'A la mitad', accesibilidad: 'Desactivado' },
  "Redmi Note 12 Pro": { gen: '194', rojo: '190', x2: '185', x4: '180', dpi: '550', boton: '48', sup: '0.6ms', velPuntero: 'A la mitad + 2', accesibilidad: 'Búsqueda Lineal' },
  "Redmi Note 12 Pro+": { gen: '195', rojo: '192', x2: '188', x4: '182', dpi: '580', boton: '46', sup: '0.5ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda Lineal' },
  "Redmi Note 13": { gen: '192', rojo: '188', x2: '182', x4: '178', dpi: '520', boton: '48', sup: '0.7ms', velPuntero: 'A la mitad + 1', accesibilidad: 'Desactivado' },
  "Redmi Note 13 Pro": { gen: '196', rojo: '192', x2: '188', x4: '184', dpi: '600', boton: '45', sup: '0.5ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda Lineal' },
  "Redmi Note 13 Pro+": { gen: '198', rojo: '195', x2: '190', x4: '185', dpi: '620', boton: '44', sup: '0.4ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda por Punto' },
  "Redmi Note 14": { gen: '194', rojo: '190', x2: '185', x4: '180', dpi: '550', boton: '46', sup: '0.6ms', velPuntero: 'Al máximo', accesibilidad: 'Desactivado' },
  "Redmi Note 14 Pro": { gen: '198', rojo: '195', x2: '190', x4: '185', dpi: '620', boton: '43', sup: '0.4ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda Lineal' },
  "Redmi Note 14 Pro+": { gen: '200', rojo: '198', x2: '194', x4: '188', dpi: '650', boton: '42', sup: '0.2ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda por Punto' },
  "Redmi Note 15 Pro (2026)": { gen: '200', rojo: '200', x2: '196', x4: '192', dpi: '680', boton: '40', sup: 'Desactivado', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda por Punto' },
  "Xiaomi 13T Pro": { gen: '200', rojo: '196', x2: '192', x4: '188', dpi: '680', boton: '42', sup: '0.2ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda por Punto' },
  "Xiaomi 14 Ultra": { gen: '200', rojo: '200', x2: '198', x4: '195', dpi: '720', boton: '38', sup: 'Desactivado', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda por Punto' },
  "Genérica Xiaomi": { gen: '194', rojo: '188', x2: '182', x4: '178', dpi: '550', boton: '48', sup: '0.6ms', velPuntero: 'A la mitad + 2', accesibilidad: 'Búsqueda Lineal' },
  "Tecno Spark 10 Pro": { gen: '192', rojo: '188', x2: '182', x4: '178', dpi: '480', boton: '50', sup: '0.8ms', velPuntero: 'A la mitad + 2', accesibilidad: 'Desactivado' },
  "Tecno Spark 20": { gen: '190', rojo: '185', x2: '180', x4: '175', dpi: '460', boton: '52', sup: '0.8ms', velPuntero: 'A la mitad + 1', accesibilidad: 'Desactivado' },
  "Tecno Spark 20 Pro": { gen: '194', rojo: '190', x2: '185', x4: '180', dpi: '500', boton: '48', sup: '0.6ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda Lineal' },
  "Tecno Spark 20 Pro+": { gen: '195', rojo: '192', x2: '188', x4: '182', dpi: '520', boton: '46', sup: '0.5ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda Lineal' },
  "Tecno Spark 30 (2026)": { gen: '198', rojo: '195', x2: '190', x4: '185', dpi: '550', boton: '44', sup: '0.4ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda por Punto' },
  "Tecno Pova 5": { gen: '192', rojo: '188', x2: '182', x4: '178', dpi: '500', boton: '50', sup: '0.7ms', velPuntero: 'A la mitad + 2', accesibilidad: 'Búsqueda Lineal' },
  "Tecno Pova 5 Pro": { gen: '195', rojo: '192', x2: '188', x4: '184', dpi: '550', boton: '46', sup: '0.5ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda Lineal' },
  "Tecno Pova 6": { gen: '196', rojo: '192', x2: '188', x4: '184', dpi: '580', boton: '45', sup: '0.5ms', velPuntero: 'Al máximo', accesibilidad: 'Desactivado' },
  "Tecno Pova 6 Pro": { gen: '198', rojo: '195', x2: '190', x4: '186', dpi: '600', boton: '43', sup: '0.3ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda por Punto' },
  "Tecno Pova 6 Neo": { gen: '195', rojo: '190', x2: '185', x4: '180', dpi: '550', boton: '46', sup: '0.6ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda Lineal' },
  "Tecno Camon 20": { gen: '192', rojo: '188', x2: '182', x4: '178', dpi: '480', boton: '48', sup: '0.8ms', velPuntero: 'A la mitad + 2', accesibilidad: 'Desactivado' },
  "Tecno Camon 20 Pro": { gen: '195', rojo: '190', x2: '185', x4: '180', dpi: '520', boton: '46', sup: '0.6ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda Lineal' },
  "Tecno Camon 20 Premier": { gen: '196', rojo: '194', x2: '188', x4: '182', dpi: '550', boton: '44', sup: '0.4ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda por Punto' },
  "Tecno Camon 30": { gen: '196', rojo: '192', x2: '188', x4: '182', dpi: '550', boton: '45', sup: '0.5ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda Lineal' },
  "Tecno Camon 30 Pro": { gen: '198', rojo: '195', x2: '190', x4: '185', dpi: '600', boton: '43', sup: '0.3ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda por Punto' },
  "Tecno Camon 30 Premier": { gen: '200', rojo: '198', x2: '194', x4: '188', dpi: '650', boton: '42', sup: '0.2ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda por Punto' },
  "Tecno Camon 40 Pro (2026)": { gen: '200', rojo: '200', x2: '198', x4: '195', dpi: '700', boton: '40', sup: 'Desactivado', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda por Punto' },
  "Genérica Tecno": { gen: '192', rojo: '188', x2: '182', x4: '178', dpi: '500', boton: '48', sup: '0.6ms', velPuntero: 'A la mitad + 2', accesibilidad: 'Desactivado' },
  "Infinix Hot 30": { gen: '190', rojo: '185', x2: '180', x4: '175', dpi: '460', boton: '52', sup: '0.8ms', velPuntero: 'A la mitad + 1', accesibilidad: 'Desactivado' },
  "Infinix Hot 40": { gen: '192', rojo: '188', x2: '182', x4: '178', dpi: '480', boton: '50', sup: '0.7ms', velPuntero: 'A la mitad + 2', accesibilidad: 'Búsqueda Lineal' },
  "Infinix Hot 40 Pro": { gen: '195', rojo: '192', x2: '188', x4: '182', dpi: '520', boton: '46', sup: '0.5ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda Lineal' },
  "Infinix Hot 50 (2026)": { gen: '198', rojo: '195', x2: '190', x4: '185', dpi: '550', boton: '44', sup: '0.4ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda por Punto' },
  "Infinix Note 30": { gen: '192', rojo: '188', x2: '182', x4: '178', dpi: '480', boton: '48', sup: '0.8ms', velPuntero: 'A la mitad + 2', accesibilidad: 'Desactivado' },
  "Infinix Note 30 Pro": { gen: '195', rojo: '190', x2: '185', x4: '180', dpi: '520', boton: '45', sup: '0.6ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda Lineal' },
  "Infinix Note 30 VIP": { gen: '196', rojo: '194', x2: '188', x4: '184', dpi: '550', boton: '44', sup: '0.4ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda por Punto' },
  "Infinix Note 40": { gen: '195', rojo: '190', x2: '185', x4: '180', dpi: '520', boton: '46', sup: '0.6ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda Lineal' },
  "Infinix Note 40 Pro": { gen: '198', rojo: '195', x2: '190', x4: '185', dpi: '580', boton: '43', sup: '0.4ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda por Punto' },
  "Infinix Note 40 Pro+": { gen: '200', rojo: '196', x2: '192', x4: '188', dpi: '600', boton: '42', sup: '0.2ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda por Punto' },
  "Infinix Note 50 VIP (2026)": { gen: '200', rojo: '200', x2: '196', x4: '192', dpi: '650', boton: '40', sup: 'Desactivado', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda por Punto' },
  "Infinix GT 10 Pro": { gen: '198', rojo: '195', x2: '190', x4: '185', dpi: '600', boton: '43', sup: '0.3ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda por Punto' },
  "Infinix GT 20 Pro": { gen: '200', rojo: '198', x2: '194', x4: '190', dpi: '650', boton: '40', sup: '0.2ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda por Punto' },
  "Genérica Infinix": { gen: '192', rojo: '188', x2: '182', x4: '178', dpi: '500', boton: '48', sup: '0.6ms', velPuntero: 'A la mitad + 2', accesibilidad: 'Desactivado' },
  "Moto G60": { gen: '190', rojo: '185', x2: '180', x4: '175', dpi: '450', boton: '55', sup: '1.0ms', velPuntero: 'A la mitad', accesibilidad: 'Desactivado' },
  "Moto G200": { gen: '195', rojo: '190', x2: '185', x4: '180', dpi: '550', boton: '48', sup: '0.6ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda Lineal' },
  "Edge 30": { gen: '194', rojo: '188', x2: '182', x4: '178', dpi: '500', boton: '48', sup: '0.6ms', velPuntero: 'A la mitad + 2', accesibilidad: 'Desactivado' },
  "Edge 30 Pro": { gen: '196', rojo: '192', x2: '188', x4: '182', dpi: '550', boton: '45', sup: '0.5ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda Lineal' },
  "Edge 30 Ultra": { gen: '198', rojo: '195', x2: '190', x4: '185', dpi: '600', boton: '43', sup: '0.3ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda por Punto' },
  "Edge 40": { gen: '196', rojo: '192', x2: '188', x4: '184', dpi: '580', boton: '45', sup: '0.4ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda Lineal' },
  "Edge 40 Neo": { gen: '195', rojo: '190', x2: '185', x4: '180', dpi: '550', boton: '46', sup: '0.5ms', velPuntero: 'Al máximo', accesibilidad: 'Desactivado' },
  "Edge 40 Pro": { gen: '198', rojo: '195', x2: '190', x4: '186', dpi: '620', boton: '42', sup: '0.2ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda por Punto' },
  "Edge 50 Pro": { gen: '200', rojo: '196', x2: '192', x4: '188', dpi: '650', boton: '42', sup: '0.2ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda por Punto' },
  "Edge 50 Ultra": { gen: '200', rojo: '200', x2: '196', x4: '192', dpi: '680', boton: '40', sup: 'Desactivado', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda por Punto' },
  "Edge 60 Pro (2026)": { gen: '200', rojo: '200', x2: '200', x4: '195', dpi: '700', boton: '38', sup: 'Desactivado', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda por Punto' },
  "Genérica Motorola": { gen: '192', rojo: '188', x2: '182', x4: '178', dpi: '500', boton: '48', sup: '0.6ms', velPuntero: 'A la mitad + 2', accesibilidad: 'Desactivado' },
  "Huawei P50": { gen: '192', rojo: '188', x2: '182', x4: '178', dpi: '500', boton: '50', sup: '0.8ms', velPuntero: 'A la mitad + 2', accesibilidad: 'Desactivado' },
  "Huawei P50 Pro": { gen: '196', rojo: '192', x2: '188', x4: '182', dpi: '580', boton: '46', sup: '0.5ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda Lineal' },
  "Huawei P60": { gen: '196', rojo: '194', x2: '188', x4: '184', dpi: '580', boton: '45', sup: '0.4ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda Lineal' },
  "Huawei P60 Pro": { gen: '198', rojo: '196', x2: '192', x4: '188', dpi: '620', boton: '43', sup: '0.2ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda por Punto' },
  "Huawei P70": { gen: '198', rojo: '196', x2: '192', x4: '188', dpi: '600', boton: '44', sup: '0.3ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda por Punto' },
  "Huawei P70 Pro": { gen: '200', rojo: '198', x2: '196', x4: '192', dpi: '650', boton: '40', sup: 'Desactivado', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda por Punto' },
  "Huawei Mate 50 Pro": { gen: '198', rojo: '194', x2: '190', x4: '186', dpi: '600', boton: '44', sup: '0.4ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda Lineal' },
  "Huawei Mate 60 Pro": { gen: '200', rojo: '196', x2: '194', x4: '190', dpi: '650', boton: '42', sup: '0.2ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda por Punto' },
  "Genérica Huawei": { gen: '194', rojo: '190', x2: '185', x4: '180', dpi: '520', boton: '46', sup: '0.5ms', velPuntero: 'A la mitad + 2', accesibilidad: 'Desactivado' },
  "Honor 70": { gen: '194', rojo: '188', x2: '182', x4: '178', dpi: '500', boton: '48', sup: '0.6ms', velPuntero: 'A la mitad + 2', accesibilidad: 'Búsqueda Lineal' },
  "Honor 90 Lite": { gen: '192', rojo: '186', x2: '180', x4: '176', dpi: '480', boton: '50', sup: '0.8ms', velPuntero: 'A la mitad + 1', accesibilidad: 'Desactivado' },
  "Honor 90": { gen: '196', rojo: '192', x2: '188', x4: '182', dpi: '550', boton: '45', sup: '0.5ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda Lineal' },
  "Honor 100": { gen: '196', rojo: '194', x2: '188', x4: '184', dpi: '580', boton: '44', sup: '0.4ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda Lineal' },
  "Honor 100 Pro": { gen: '198', rojo: '196', x2: '192', x4: '188', dpi: '620', boton: '42', sup: '0.2ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda por Punto' },
  "Honor 200": { gen: '198', rojo: '195', x2: '190', x4: '186', dpi: '600', boton: '43', sup: '0.3ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda Lineal' },
  "Honor 200 Pro": { gen: '200', rojo: '198', x2: '194', x4: '190', dpi: '650', boton: '40', sup: '0.1ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda por Punto' },
  "Honor 110 Pro": { gen: '200', rojo: '200', x2: '196', x4: '192', dpi: '680', boton: '40', sup: 'Desactivado', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda por Punto' },
  "Honor 120 Ultra (2026)": { gen: '200', rojo: '200', x2: '200', x4: '198', dpi: '720', boton: '38', sup: 'Desactivado', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda por Punto' },
  "Honor Magic 5 Pro": { gen: '198', rojo: '196', x2: '192', x4: '188', dpi: '650', boton: '42', sup: '0.2ms', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda por Punto' },
  "Honor Magic 6 Pro": { gen: '200', rojo: '200', x2: '196', x4: '192', dpi: '700', boton: '40', sup: 'Desactivado', velPuntero: 'Al máximo', accesibilidad: 'Búsqueda por Punto' },
  "Genérica Honor": { gen: '194', rojo: '190', x2: '185', x4: '180', dpi: '520', boton: '46', sup: '0.5ms', velPuntero: 'A la mitad + 2', accesibilidad: 'Desactivado' }
};

interface ComAporte {
  id: number;
  modelo: string;
  gen: string;
  rojo: string;
  x2: string;
  x4: string;
  dpi: string;
  boton: string;
  sup: string;
  velPuntero?: string;
  accesibilidad?: string;
  autor: string;
  likes: number;
  dislikes: number;
}

export default function App() {
  const [modelo, setModelo] = useState<string>('');
  const [marcaActiva, setMarcaActiva] = useState<string>('');
  const [sensi, setSensi] = useState({ gen: '', rojo: '', x2: '', x4: '' });
  const [dpi, setDpi] = useState<string>('');
  const [boton, setBoton] = useState<string>('');
  const [supresor, setSupresor] = useState<string>('');
  const [velPuntero, setVelPuntero] = useState<string>('');
  const [accesibilidad, setAccesibilidad] = useState<string>('');
  const [esApple, setEsApple] = useState<boolean>(false);
  const [tab, setTab] = useState<string>('oficial');
  const [configCargada, setConfigCargada] = useState<boolean>(false);
  const [configNoEncontrada, setConfigNoEncontrada] = useState<boolean>(false);
  const [comunidadDatos, setComunidadDatos] = useState<ComAporte[]>([]);
  const [busquedaComunidad, setBusquedaComunidad] = useState<string>('');
  const [userVotes, setUserVotes] = useState<Record<number, 'like' | 'dislike'>>({});
  const [mostrarFormulario, setMostrarFormulario] = useState<boolean>(false);
  const [favoritos, setFavoritos] = useState<string[]>([]);
  const [filtroCom, setFiltroCom] = useState<'top' | 'reciente'>('top');
  const [form, setForm] = useState({
    autor: '', marca: 'Samsung', modelo: '', gen: '', rojo: '', x2: '', x4: '',
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
      const { data, error } = await supabase.from('comunidad').select('*').order('created_at', { ascending: false });
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

  const getRecomendaciones = (mod: string) => {
    const lower = mod.toLowerCase();
    if (lower.includes('ultra') || lower.includes('pro max') || lower.includes('premier') || lower.includes('vip') || lower.includes('15 pro') || lower.includes('16 pro') || lower.includes('17 pro') || lower.includes('14 pro') || lower.includes('s24') || lower.includes('s25') || lower.includes('s26')) return { graf: 'Ultra / Max', fps: 'Altos', hud: '3-4 Dedos' };
    if (lower.includes('pro') || lower.includes('plus') || lower.includes('13') || lower.includes('s22') || lower.includes('s23') || lower.includes('edge 50')) return { graf: 'Estándar', fps: 'Altos', hud: '3 Dedos' };
    return { graf: 'Suave', fps: 'Normales', hud: '2 Dedos' };
  };

  const buscarConfiguracion = (nombre: string) => {
    const term = nombre.trim();
    if (!term) return;
    const isAppleDevice = term.toLowerCase().includes('apple') || term.toLowerCase().includes('iphone');
    setEsApple(isAppleDevice);
    
    const keyMatch = Object.keys(DB_CONFIGS).find(k => k.toLowerCase() === term.toLowerCase());
    const config = keyMatch ? DB_CONFIGS[keyMatch] : null;

    if (config) {
      setSensi({ gen: config.gen, rojo: config.rojo, x2: config.x2, x4: config.x4 });
      setDpi(config.dpi);
      setBoton(config.boton);
      setSupresor(config.sup);
      setVelPuntero(config.velPuntero || (isAppleDevice ? 'N/A' : 'A la mitad'));
      setAccesibilidad(config.accesibilidad || (isAppleDevice ? 'N/A' : 'Desactivado'));
      setConfigCargada(true); setConfigNoEncontrada(false); setModelo(keyMatch || term);
    } else {
      setConfigCargada(false); setConfigNoEncontrada(true); setModelo(term);
    }
  };

  const seleccionarMarca = (marca: string) => {
    setMarcaActiva(marcaActiva === marca ? '' : marca);
    setConfigCargada(false); setConfigNoEncontrada(false); setModelo('');
  };

  const gestionarVoto = async (id: number, modeloItem: string, tipo: 'like' | 'dislike') => {
    const currentVote = userVotes[id];
    if (tipo === 'like' && currentVote !== 'like') {
      const yaDioLike = comunidadDatos.find(item => item.modelo === modeloItem && userVotes[item.id] === 'like');
      if (yaDioLike) { showToast("Solo 1 Like por dispositivo"); return; }
    }

    let likesUpdate = 0;
    let dislikesUpdate = 0;

    setComunidadDatos(prev => prev.map(item => {
      if (item.id === id) {
        let { likes, dislikes } = item;
        if (currentVote === tipo) {
          tipo === 'like' ? likes-- : dislikes--;
          const nv = { ...userVotes }; delete nv[id]; setUserVotes(nv);
        } else {
          if (tipo === 'like') { likes++; if (currentVote === 'dislike') dislikes--; }
          else { dislikes++; if (currentVote === 'like') likes--; }
          setUserVotes({ ...userVotes, [id]: tipo });
        }
        likesUpdate = likes;
        dislikesUpdate = dislikes;
        return { ...item, likes, dislikes };
      }
      return item;
    }));

    await supabase.from('comunidad').update({ likes: likesUpdate, dislikes: dislikesUpdate }).eq('id', id);
  };

  const guardarAporte = async () => {
    if (!form.autor || !form.modelo || !form.gen) { showToast("Llena los campos"); return; }
    const isAppleDevice = form.marca === 'Apple';
    const nuevoAporte = {
      modelo: `${form.marca} ${form.modelo}`,
      gen: form.gen,
      rojo: form.rojo || form.gen,
      x2: form.x2 || '190',
      x4: form.x4 || '185',
      dpi: isAppleDevice ? `${form.tipoApple} ${form.dpiValor}` : (form.dpi || '500'),
      boton: form.boton,
      sup: form.supresor || '0.5ms',
      velPuntero: isAppleDevice ? 'N/A' : (form.velPuntero || 'A la mitad'),
      accesibilidad: isAppleDevice ? 'N/A' : (form.accesibilidad || 'Desactivado'),
      autor: form.autor,
      likes: 0,
      dislikes: 0
    };

    const { data, error } = await supabase.from('comunidad').insert([nuevoAporte]).select();

    if (data) {
      AsyncStorage.setItem('@autor', form.autor);
      setComunidadDatos([data[0] as ComAporte, ...comunidadDatos]);
      setMostrarFormulario(false);
      showToast("Aporte guardado en la nube");
    } else {
      showToast("Error al guardar");
    }
  };

  const toggleFav = (idItem: string) => {
    setFavoritos(prev => {
      if (prev.includes(idItem)) { showToast("Eliminado de Favoritos"); return prev.filter(i => i !== idItem); }
      showToast("Añadido a Favoritos"); return [...prev, idItem];
    });
  };

  const dataComunidadRender = [...comunidadDatos]
    .filter(i => i.modelo.toLowerCase().includes(busquedaComunidad.toLowerCase()))
    .sort((a, b) => filtroCom === 'top' ? b.likes - a.likes : b.id - a.id);

  const recom = getRecomendaciones(modelo);

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

      {tab === 'oficial' ? (
        <ScrollView style={{ width: '100%' }} contentContainerStyle={{ alignItems: 'center' }}>
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
            <TextInput style={styles.input} placeholder="Busca tu modelo oficial..." placeholderTextColor="#666" value={modelo} onChangeText={(t) => { setModelo(t); buscarConfiguracion(t); }} />
          ) : (
            <View style={styles.dropdown}>
              <ScrollView nestedScrollEnabled={true} style={{ maxHeight: 180 }}>
                {MODELOS_POR_MARCA[marcaActiva]?.map((mod) => (
                  <TouchableOpacity key={mod} style={styles.dropItem} onPress={() => buscarConfiguracion(mod)}><Text style={styles.dropText}>{mod}</Text></TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {configCargada && (
            <View style={styles.card}>
              <View style={styles.comHeader}>
                <Text style={styles.label}>{modelo.toUpperCase()}</Text>
                <TouchableOpacity onPress={() => toggleFav(modelo)}><Text style={{fontSize: 20}}>{favoritos.includes(modelo) ? '⭐' : '☆'}</Text></TouchableOpacity>
              </View>
              
              <View style={styles.recomBox}>
                <Text style={styles.recomText}>🎮 Gráficos: {recom.graf} | FPS: {recom.fps}</Text>
                <Text style={styles.recomText}>🖐️ Recomendado para: {recom.hud}</Text>
              </View>

              <View style={styles.row}>
                <View><Text style={styles.text}>General: <Text style={styles.val}>{sensi.gen}</Text></Text><Text style={styles.text}>Punto Rojo: <Text style={styles.val}>{sensi.rojo}</Text></Text></View>
                <View><Text style={styles.text}>Mira x2: <Text style={styles.val}>{sensi.x2}</Text></Text><Text style={styles.text}>Mira x4: <Text style={styles.val}>{sensi.x4}</Text></Text></View>
              </View>
              <View style={styles.divider} />
              <Text style={styles.text}>{esApple ? 'Ajuste Interno' : 'DPI'}: <Text style={styles.val}>{dpi}</Text></Text>
              <Text style={styles.text}>Botón: <Text style={styles.val}>{boton}%</Text></Text>
              <Text style={styles.text}>{esApple ? 'Control Botón' : 'Supresor'}: <Text style={styles.val}>{supresor}</Text></Text>
              {!esApple && (
                <>
                  <Text style={styles.text}>Vel. Puntero: <Text style={styles.val}>{velPuntero}</Text></Text>
                  <Text style={styles.text}>Interruptores: <Text style={styles.val}>{accesibilidad}</Text></Text>
                </>
              )}
              <TouchableOpacity style={styles.btnCopiar} onPress={() => { Clipboard.setString(`Sensi: ${sensi.gen} | DPI: ${dpi}`); showToast("Copiado al portapapeles"); }}><Text style={styles.btnText}>COPIAR CONFIG</Text></TouchableOpacity>
            </View>
          )}

          {configNoEncontrada && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>Aún no hay configuración oficial para "{modelo}".</Text>
              <Text style={styles.errorSubText}>Prueba con otra variante.</Text>
            </View>
          )}
        </ScrollView>
      ) : tab === 'comunidad' ? (
        <ScrollView style={styles.cardCom} contentContainerStyle={{ paddingBottom: 30 }}>
          {!mostrarFormulario ? (
            <>
              <TextInput style={styles.inputCom} placeholder="Filtrar por modelo..." placeholderTextColor="#666" value={busquedaComunidad} onChangeText={setBusquedaComunidad} />
              
              <View style={styles.filterRow}>
                <TouchableOpacity style={[styles.filterBtn, filtroCom === 'top' && styles.filterBtnAct]} onPress={() => setFiltroCom('top')}><Text style={styles.filterText}>🔥 Más Votados</Text></TouchableOpacity>
                <TouchableOpacity style={[styles.filterBtn, filtroCom === 'reciente' && styles.filterBtnAct]} onPress={() => setFiltroCom('reciente')}><Text style={styles.filterText}>🕒 Recientes</Text></TouchableOpacity>
              </View>

              {dataComunidadRender.map((item) => (
                <View key={item.id} style={styles.comItem}>
                  <View style={styles.comHeader}>
                    <Text style={styles.comModelo}>{item.modelo}</Text>
                    <View style={styles.votes}>
                      <TouchableOpacity onPress={() => toggleFav(item.id.toString())} style={{marginRight: 10}}><Text style={{fontSize: 16}}>{favoritos.includes(item.id.toString()) ? '⭐' : '☆'}</Text></TouchableOpacity>
                      <TouchableOpacity style={[styles.voteBtn, userVotes[item.id] === 'like' && styles.activeLike]} onPress={() => gestionarVoto(item.id, item.modelo, 'like')}><Text style={styles.voteText}>👍 {item.likes}</Text></TouchableOpacity>
                      <TouchableOpacity style={[styles.voteBtn, userVotes[item.id] === 'dislike' && styles.activeDislike]} onPress={() => gestionarVoto(item.id, item.modelo, 'dislike')}><Text style={styles.voteText}>👎 {item.dislikes}</Text></TouchableOpacity>
                    </View>
                  </View>
                  <Text style={styles.comSensi}>General: {item.gen} | {item.modelo.includes('Apple') ? 'Ajuste' : 'DPI'}: {item.dpi}</Text>
                  <Text style={styles.comAutor}>Por: {item.autor}</Text>
                  <View style={styles.dividerSmall} />
                </View>
              ))}
              <TouchableOpacity style={styles.btnShare} onPress={() => setMostrarFormulario(true)}><Text style={styles.btnText}>COMPARTIR MI SENSI</Text></TouchableOpacity>
            </>
          ) : (
            <View>
              <Text style={styles.label}>NUEVO APORTE A LA COMUNIDAD</Text>
              <TextInput style={styles.formInput} placeholder="Tu Nombre/Alias" placeholderTextColor="#666" value={form.autor} onChangeText={(t) => setForm({ ...form, autor: t })} />
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 10 }}>
                {MARCAS.map((m) => (
                  <TouchableOpacity key={m} style={[styles.marcaBtn, form.marca === m && styles.marcaBtnActiva]} onPress={() => setForm({ ...form, marca: m })}>
                    <Text style={[styles.marcaText, form.marca === m && styles.marcaTextActiva]}>{m}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <TextInput style={styles.formInput} placeholder="Modelo Exacto (Ej: 17 Pro Max)" placeholderTextColor="#666" value={form.modelo} onChangeText={(t) => setForm({ ...form, modelo: t })} />
              <View style={styles.row}>
                <TextInput style={[styles.formInput, { flex: 1, marginRight: 5 }]} placeholder="General" placeholderTextColor="#666" keyboardType="numeric" value={form.gen} onChangeText={(t) => setForm({ ...form, gen: t })} />
                <TextInput style={[styles.formInput, { flex: 1, marginLeft: 5 }]} placeholder="Punto Rojo" placeholderTextColor="#666" keyboardType="numeric" value={form.rojo} onChangeText={(t) => setForm({ ...form, rojo: t })} />
              </View>
              <View style={styles.row}>
                <TextInput style={[styles.formInput, { flex: 1, marginRight: 5 }]} placeholder="Mira x2" placeholderTextColor="#666" keyboardType="numeric" value={form.x2} onChangeText={(t) => setForm({ ...form, x2: t })} />
                <TextInput style={[styles.formInput, { flex: 1, marginLeft: 5 }]} placeholder="Mira x4" placeholderTextColor="#666" keyboardType="numeric" value={form.x4} onChangeText={(t) => setForm({ ...form, x4: t })} />
              </View>

              <View style={styles.dividerSmall} />

              {form.marca === 'Apple' ? (
                <View>
                  <Text style={[styles.label, { marginBottom: 5 }]}>AJUSTES APPLE</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 10 }}>
                    {['Refinado', 'Deslizante', 'Sencillo'].map(tipo => (
                      <TouchableOpacity key={tipo} style={[styles.marcaBtn, form.tipoApple === tipo && styles.marcaBtnActiva]} onPress={() => setForm({ ...form, tipoApple: tipo })}>
                        <Text style={[styles.marcaText, form.tipoApple === tipo && styles.marcaTextActiva]}>{tipo}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                  <View style={styles.row}>
                    <TextInput style={[styles.formInput, { flex: 1, marginRight: 4 }]} placeholder="Valor Ajuste" placeholderTextColor="#666" keyboardType="numeric" value={form.dpiValor} onChangeText={(t) => setForm({ ...form, dpiValor: t })} />
                    <TextInput style={[styles.formInput, { flex: 1, marginHorizontal: 4 }]} placeholder="Botón %" placeholderTextColor="#666" keyboardType="numeric" value={form.boton} onChangeText={(t) => setForm({ ...form, boton: t })} />
                    <TextInput style={[styles.formInput, { flex: 1, marginLeft: 4 }]} placeholder="Ctrl. Botón" placeholderTextColor="#666" value={form.supresor} onChangeText={(t) => setForm({ ...form, supresor: t })} />
                  </View>
                </View>
              ) : (
                <View>
                  <Text style={[styles.label, { marginBottom: 5 }]}>AJUSTES ANDROID</Text>
                  <View style={styles.row}>
                    <TextInput style={[styles.formInput, { flex: 1, marginRight: 4 }]} placeholder="DPI" placeholderTextColor="#666" keyboardType="numeric" value={form.dpi} onChangeText={(t) => setForm({ ...form, dpi: t })} />
                    <TextInput style={[styles.formInput, { flex: 1, marginHorizontal: 4 }]} placeholder="Botón %" placeholderTextColor="#666" keyboardType="numeric" value={form.boton} onChangeText={(t) => setForm({ ...form, boton: t })} />
                    <TextInput style={[styles.formInput, { flex: 1, marginLeft: 4 }]} placeholder="Supresor" placeholderTextColor="#666" value={form.supresor} onChangeText={(t) => setForm({ ...form, supresor: t })} />
                  </View>
                  <View style={styles.row}>
                    <TextInput style={[styles.formInput, { flex: 1, marginRight: 4 }]} placeholder="Vel. Puntero" placeholderTextColor="#666" value={form.velPuntero} onChangeText={(t) => setForm({ ...form, velPuntero: t })} />
                    <TextInput style={[styles.formInput, { flex: 1, marginLeft: 4 }]} placeholder="Acc. Interruptores" placeholderTextColor="#666" value={form.accesibilidad} onChangeText={(t) => setForm({ ...form, accesibilidad: t })} />
                  </View>
                </View>
              )}

              <View style={styles.btnGroup}>
                <TouchableOpacity style={[styles.button, { flex: 1, marginRight: 5, backgroundColor: '#333' }]} onPress={() => setMostrarFormulario(false)}>
                  <Text style={styles.buttonText}>CANCELAR</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, { flex: 1, marginLeft: 5 }]} onPress={guardarAporte}>
                  <Text style={styles.buttonText}>GUARDAR</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </ScrollView>
      ) : (
        <ScrollView style={styles.cardCom}>
          <Text style={styles.label}>TUS CONFIGURACIONES FAVORITAS</Text>
          {favoritos.length === 0 ? (
            <Text style={{color: '#666', textAlign: 'center', marginTop: 20}}>No tienes favoritos guardados.</Text>
          ) : (
            favoritos.map(fav => {
              const ofi = DB_CONFIGS[fav];
              if(ofi) {
                return (
                  <View key={fav} style={styles.comItem}>
                    <View style={styles.comHeader}>
                      <Text style={styles.comModelo}>[Oficial] {fav}</Text>
                      <TouchableOpacity onPress={() => toggleFav(fav)}><Text style={{fontSize: 16}}>⭐</Text></TouchableOpacity>
                    </View>
                    <Text style={styles.comSensi}>Gen: {ofi.gen} | DPI/Ajuste: {ofi.dpi}</Text>
                    <View style={styles.dividerSmall} />
                  </View>
                )
              }
              const comItem = comunidadDatos.find(c => c.id.toString() === fav);
              if(comItem) {
                return (
                  <View key={fav} style={styles.comItem}>
                    <View style={styles.comHeader}>
                      <Text style={styles.comModelo}>[Comunidad] {comItem.modelo}</Text>
                      <TouchableOpacity onPress={() => toggleFav(fav)}><Text style={{fontSize: 16}}>⭐</Text></TouchableOpacity>
                    </View>
                    <Text style={styles.comSensi}>Gen: {comItem.gen} | Por: {comItem.autor}</Text>
                    <View style={styles.dividerSmall} />
                  </View>
                )
              }
              return null;
            })
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#050505', alignItems: 'center', paddingTop: 50 },
  toast: { position: 'absolute', top: 50, zIndex: 100, backgroundColor: '#00FF0033', padding: 10, borderRadius: 10, borderWidth: 1, borderColor: '#00FF00' },
  toastText: { color: '#FFF', fontWeight: 'bold' },
  header: { alignItems: 'center', marginBottom: 10 },
  logo: { width: 85, height: 85, borderRadius: 18 },
  title: { fontSize: 18, fontWeight: '900', color: '#FF0000', marginTop: 5, letterSpacing: 2 },
  tabContainer: { flexDirection: 'row', width: '90%', marginVertical: 10 },
  tab: { flex: 1, padding: 10, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: '#222' },
  tabActive: { borderBottomColor: '#FF0000' },
  tabText: { color: '#666', fontWeight: 'bold', fontSize: 13 },
  tabTextActive: { color: '#FF0000' },
  marcasWrapper: { height: 45, marginBottom: 10, width: '100%' },
  marcasContainer: { paddingHorizontal: 15, flexDirection: 'row', alignItems: 'center' },
  marcaBtn: { backgroundColor: '#111', paddingVertical: 6, paddingHorizontal: 14, borderRadius: 20, marginRight: 8, borderWidth: 1, borderColor: '#333' },
  marcaBtnActiva: { backgroundColor: '#FF0000', borderColor: '#FF0000' },
  marcaText: { color: '#888', fontWeight: 'bold', fontSize: 11 },
  marcaTextActiva: { color: '#FFF' },
  input: { width: '90%', backgroundColor: '#111', color: '#FFF', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#222' },
  dropdown: { width: '90%', backgroundColor: '#0A0A0A', borderRadius: 10, borderWidth: 1, borderColor: '#333', padding: 10 },
  dropItem: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#1A1A1A' },
  dropText: { color: '#AAA', fontSize: 13 },
  card: { width: '90%', backgroundColor: '#111', borderRadius: 20, padding: 20, marginTop: 10, borderWidth: 1, borderColor: '#FF000022' },
  recomBox: { backgroundColor: '#222', padding: 10, borderRadius: 8, marginBottom: 10, borderWidth: 1, borderColor: '#444' },
  recomText: { color: '#AAA', fontSize: 11, fontWeight: 'bold' },
  errorBox: { width: '90%', backgroundColor: '#1A0000', borderRadius: 15, padding: 25, marginTop: 20, borderWidth: 1, borderColor: '#FF000033', alignItems: 'center' },
  errorText: { color: '#FF8888', fontWeight: 'bold', textAlign: 'center', fontSize: 13 },
  errorSubText: { color: '#555', fontSize: 11, marginTop: 5 },
  label: { color: '#FF0000', fontWeight: 'bold', marginBottom: 10, fontSize: 13 },
  text: { color: '#AAA', marginBottom: 4, fontSize: 13 },
  val: { color: '#FFF', fontWeight: 'bold' },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  divider: { height: 1, backgroundColor: '#222', marginVertical: 10 },
  dividerSmall: { height: 1, backgroundColor: '#1A1A1A', marginTop: 10 },
  btnCopiar: { backgroundColor: '#FF0000', padding: 14, borderRadius: 10, alignItems: 'center', marginTop: 15 },
  btnShare: { backgroundColor: '#FF0000', padding: 14, borderRadius: 10, alignItems: 'center', marginTop: 20 },
  btnText: { color: '#FFF', fontWeight: 'bold', fontSize: 12 },
  cardCom: { width: '90%', backgroundColor: '#111', borderRadius: 20, padding: 15, borderWidth: 1, borderColor: '#222' },
  filterRow: { flexDirection: 'row', marginBottom: 15 },
  filterBtn: { flex: 1, backgroundColor: '#1A1A1A', padding: 8, alignItems: 'center', borderWidth: 1, borderColor: '#333' },
  filterBtnAct: { backgroundColor: '#FF000033', borderColor: '#FF0000' },
  filterText: { color: '#FFF', fontSize: 11, fontWeight: 'bold' },
  comItem: { marginBottom: 12 },
  comHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  comModelo: { color: '#FFF', fontWeight: 'bold', fontSize: 14 },
  votes: { flexDirection: 'row', alignItems: 'center' },
  voteBtn: { backgroundColor: '#1A1A1A', padding: 7, borderRadius: 8, marginLeft: 5, minWidth: 45, alignItems: 'center' },
  activeLike: { backgroundColor: '#00FF0015', borderColor: '#00FF00', borderWidth: 1 },
  activeDislike: { backgroundColor: '#FF000015', borderColor: '#FF0000', borderWidth: 1 },
  voteText: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },
  comSensi: { color: '#777', fontSize: 12, marginTop: 2 },
  comAutor: { color: '#444', fontSize: 10 },
  inputCom: { backgroundColor: '#1A1A1A', color: '#FFF', padding: 10, borderRadius: 8, marginBottom: 15 },
  formInput: { backgroundColor: '#1A1A1A', color: '#FFF', padding: 12, borderRadius: 8, marginBottom: 10, borderWidth: 1, borderColor: '#333' },
  button: { backgroundColor: '#FF0000', padding: 15, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: '#FFF', fontWeight: '900', fontSize: 13 },
  btnGroup: { flexDirection: 'row', marginTop: 10 }
});