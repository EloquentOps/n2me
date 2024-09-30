import { PGlite } from '@electric-sql/pglite'

const DB_NAME = 'n2me-database'

let db

const init = async () => {
    db = new PGlite(`idb://${DB_NAME}`)

    await db.exec(`
    CREATE TABLE IF NOT EXISTS settings (
        id SERIAL PRIMARY KEY,
        key TEXT UNIQUE,
        value TEXT,
        type TEXT,
        added TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM settings WHERE key = 'lang') THEN
            INSERT INTO settings (key, value, type) VALUES ('lang', 'en-US', 'general');
            INSERT INTO settings (key, value, type) VALUES ('main_input_device', 'text', 'general');
        END IF;
    END $$;

    CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name TEXT UNIQUE,
        added TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM categories WHERE name = 'note') THEN
            INSERT INTO categories (name) VALUES ('note');
        END IF;
    END $$;

    CREATE TABLE IF NOT EXISTS items (
        id SERIAL PRIMARY KEY,
        content TEXT,
        category_id INTEGER DEFAULT 1,
        added TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
`)
}

const addItem = async (content, category_id) => {
    await db.sql`INSERT INTO items (content, category_id) VALUES (${content}, ${category_id});`
}

const addCategory = async (name) => {
    await db.sql`INSERT INTO categories (name) VALUES (${name});`
}

const editSetting = async (key, value, type) => {
    await db.sql`INSERT INTO settings (key, value, type)
VALUES (${key}, ${value}, ${type})
ON CONFLICT (key)
DO UPDATE SET value = EXCLUDED.value, type = EXCLUDED.type;`
}

const getItems = async () => {
    const items = await db.exec(`
        SELECT items.*, categories.name AS category_name
        FROM items
        INNER JOIN categories
        ON items.category_id = categories.id;
    `)
    return items[0].rows
}

const getCategories = async () => {
    const categories = await db.exec(`
        SELECT * FROM categories;
    `)
    return categories[0].rows
}

const deleteCategory = async (id) => {
    await db.sql`DELETE FROM categories WHERE id = ${id};`
    await db.sql`UPDATE items SET category_id = 1 WHERE category_id = ${id};`;

}

const deleteItem = async (id) => {
    await db.sql`DELETE FROM items WHERE id = ${id};`
}

const getSettings = async () => {
    const settings = await db.exec(`
        SELECT * FROM settings;
    `)
    return settings[0].rows
}

const importItems = async (items) => {
    let sql = ''
    items.forEach(item => {
        if (item.content && item.added) {
            const cnt = item.content.replace(/'/g, "’")
            sql += `INSERT INTO items (content, added, category_id) VALUES ('${cnt}', '${new Date(item.added).toISOString()}', ${item.category_id || 1});\n`
        }
    })
    await db.exec(`${sql}`)
}


const closeDatabase = async () => {
    await db.close()
    console.log('Database closed', db.closed)
}

const deleteDatabase = () => {
    return new Promise((resolve, reject) => {

        const request = indexedDB.deleteDatabase('/pglite/' + DB_NAME)

        request.onsuccess = function() {
            console.log('Database deleted successfully')
            resolve()
        }

        request.onerror = function() {
            console.error('Error deleting database')
            reject()
        }

        request.onblocked = function() {
            console.warn(`Delete operation for '${DB_NAME}' is blocked. Please close all connections.`)
            resolve()
    }
    })
}

export { 
    init,
    addItem, 
    addCategory, 
    
    getCategories, 
    getSettings, 
    getItems,
    editSetting, 
    deleteCategory,
    deleteItem,
    importItems,
    deleteDatabase,
    closeDatabase
}