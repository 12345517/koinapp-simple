// ... (código anterior sin cambios)

// Insertar usuario de prueba
await client.query(`
  INSERT INTO users (name, email, password, role, isapproved, cedula, payment_password, referral_code)
  VALUES ('Admin User', 'admin@koinapp.com', 'admin123', 'admin', true, 'ADMIN001', 'adminpay123', 'ADMINREF001')
  ON CONFLICT (email) DO UPDATE
  SET isapproved = true, role = 'admin'
`)
console.log("Usuario admin creado o actualizado exitosamente")

// ... (resto del código sin cambios)

