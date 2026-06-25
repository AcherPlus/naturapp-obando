# NaturaApp - Arquitectura de Capas (Sem 10)

Proyecto arreglado "NaturApp" para el curso de "Taller de Construcción de Software Móvil"

**Alumno:** Enmanuel Obando (22200308)

## Descripción del proyecto:

Es un e-comerce inspirado en la página de Santa Natura, y que contiene buenas prácticas de desarrollo del software. Permite explorar sobre productos saludables, gestionar un carrito de compra, crear pedidos y administrar la configuración del usuario. 

## Situación:

El código inicial para construir el sistema cuenta con problemas de sintaxis y está incompleto en estructura, por lo que ejecutar la aplicación por primera vez puede dar errores. En vista de ello, se procede a documentar cada uno de los cambios y aportes ofrecidos para desarrollar la aplicación en su totalidad.

## 1. Carpeta "app"

Varios de los componentes de la carpeta están escritos en Javascript, pero utilizando la notación "export function", como si fueran funciones comunes. Sin embargo, se exportan como componentes, por lo que da un error y no se muestran en pantalla. Para ello, se cambia el inicio a "export default function".

Ejemplo:

```
export default function CartScreen()
```


### 1.1. Carpeta "product"

- **[id].js:** Se creó el componente para mostrar información detallada sobre los productos saludables

```
return (
<ScrollView style={[styles.container, { backgroundColor: theme.background }]}
     contentContainerStyle={styles.contentContainer}>
     <Image source={{ uri: product.image }} style={styles.image} />
     <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
     <Text style={[styles.name, { color: theme.text }]}>{product.name}</Text>
     <Text style={[styles.category, { color: theme.secondaryText }]}>Categoria: {product.category}</Text>

     <View style={styles.row}>
     <Text style={[styles.price, { color: theme.accent }]}> {product.getFormattedPrice()} </Text>
     <TouchableOpacity
          style={[styles.cartButton, { backgroundColor: theme.accent }]}
          onPress={handleAddToCart}>
          <Text style={styles.cartButtonText}>Agregar al carrito</Text>
     </TouchableOpacity>
     </View>

     <View style={styles.infoRow}>
     <View style={[styles.infoBlock, { backgroundColor: theme.surface }]}>
          <Text style={[styles.infoLabel, { color: theme.secondaryText }]}>Stock</Text>
          <Text style={[styles.infoValue, { color: theme.text }]}>{product.stock}</Text>
     </View>
     <View style={[styles.infoBlock, { backgroundColor: theme.surface }]}>
          <Text style={[styles.infoLabel, { color: theme.secondaryText }]}>Calificación</Text>
          <Text style={[styles.infoValue, { color: theme.text }]}>{product.rating?.toFixed(1) ?? '0.0'} ★</Text>
     </View>
     </View>

     <Text style={[styles.sectionTitle, { color: theme.secondaryText }]}>Descripción</Text>
     <Text style={[styles.description, { color: theme.text }]}>{product.description}</Text>

     <Text style={[styles.sectionTitle, { color: theme.secondaryText }]}>Beneficios</Text>
     {product.benefits && product.benefits.length > 0 ? (
     product.benefits.map((benefit, index) => (
          <Text key={`${benefit}-${index}`} style={[styles.benefitText, { color: theme.text }]}>• {benefit}</Text>
     ))
     ) : (
     <Text style={[styles.benefitText, { color: theme.text }]}>No hay beneficios registrados.</Text>
     )}
     </View>
</ScrollView>
);
```

### 1.2. Carpeta "tabs"

Desde esta carpeta (en el archivo home.js) inicia el ruteo hacia las demás pantallas.

- **orders.js**: Al registrar un pedido, aparece como "Pendiente" en la pantalla de "Órdenes". Caso contrario, muestra el mensaje "No hay pedidos".

```
const renderOrder = ({ item }) => (
    <View style={cardStyle}>
      <View style={styles.row}>
        <Text style={[styles.id, { color: theme.text }]}>Pedido #{item.id}</Text>
        <Text style={[styles.status, { color: item.getStatusColor() }]}> {item.status}</Text>
      </View>
      <Text style={dateStyle}>{item.getFormattedDate()}</Text>
      <Text style={totalStyle}>Total: S/ {item.total.toFixed(2)}</Text>
      <Text style={itemsStyle}>{item.items.length} items</Text>
    </View>
  );

  if (loading && orders.length === 0) {
    return <ActivityIndicator style={{ flex: 1 }} size="large" color={theme.accent} />;
  }

  return (
    <View style={containerStyle}>
      {error && <Text style={errorStyle}>{error}</Text>}
      <FlatList
        data={orders}
        keyExtractor={o => o.id.toString()}
        renderItem={renderOrder}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refresh} />
        }
        ListEmptyComponent={<Text style={emptyStyle}>No hay pedidos</Text>}
      />
    </View>
  );
```

- **profile.js**: El usuario puede guardar su nombre y correo electrónico. Proporciona un switch para cambiar a modo oscuro, y otro switch para activar las notificaciones

```
return (
    <View style={containerStyle}>
          <Text style={switchLabelStyle}>Nombre</Text>
          <TextInput
              style={inputStyle}
              value={name}
              onChangeText={setName}
              placeholder="Ingresa tu nombre"
              placeholderTextColor={theme.placeholder}
          />

          <Text style={switchLabelStyle}>Correo</Text>
          <TextInput
              style={inputStyle}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              placeholder="correo@ejemplo.com"
              placeholderTextColor={theme.placeholder}
          />

          <View style={styles.row}>
              <Text style={switchLabelStyle}>Tema oscuro</Text>
              <Switch
              value={dark}
              onValueChange={(value) => {
                    console.log('Tema oscuro:', value);
                    toggle();
              }}
              />
          </View>

          <View style={styles.row}>
              <Text style={switchLabelStyle}>Notificaciones</Text>
              <Switch value={notifications} onValueChange={toggleNotifications} />
          </View>

          <TouchableOpacity style={saveBtnStyle} onPress={handleSave}>
              <Text style={saveTextStyle}>Guardar</Text>
          </TouchableOpacity>
    </View>
);
```

## 2. Carpeta "src"

Se encuentra el backend de la aplicación, donde se hace la conexión con la base de datos local mediante API Getaway. Utilizando NodeJS se lavanta un servidor con los datos de los productos.

En **server.js** se prepara los productos para la conexión a la base de datos. De esta forma, apretando npm run server, el servidor pueda accederse a todos mediante la IP.

```
const express = require('express');

const app = express();
const PORT = process.env.PORT || 9090;

app.use(express.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
    return res.sendStatus(204);
  }
  next();
});

const products = [
  {
    id: 1,
    name: 'Maca Andina',
    description: 'Superfood energético rico en nutrientes',
    price: 25.0,
    image: 'https://proexpansion.com/uploads/article/image/1841/larger_maca.jpg',
    category: 'superfoods',
    stock: 20,
    rating: 4.8,
    benefits: ['Energía', 'Resistencia', 'Vitaminas'],
  },
  {
    id: 2,
    name: 'Aceite de Coco Extra Virgen',
    description: 'Ideal para cocinar y cuidado personal',
    price: 18.5,
    image: 'https://borganics.cl/cdn/shop/products/aceite-coco-virgen-500-scaled.jpg',
    category: 'aceites',
    stock: 15,
    rating: 4.7,
    benefits: ['Piel saludable', 'Antioxidantes'],
  },
  {
    id: 3,
    name: 'Cápsulas de Omega 3',
    description: 'Suplemento para la salud cardiovascular',
    price: 32.0,
    image: 'https://masonnatural.pe/wp-content/uploads/2020/04/Fish-Oil-Front-2.png',
    category: 'capsulas',
    stock: 10,
    rating: 4.9,
    benefits: ['Corazón', 'Cerebro'],
  },
  {
    id: 4,
    name: 'Infusión de Manzanilla',
    description: 'Bebida relajante y digestiva',
    price: 12.0,
    image: 'https://plazavea.vteximg.com.br/arquivos/ids/17782556-418-418/133196.jpg',
    category: 'infusiones',
    stock: 30,
    rating: 4.6,
    benefits: ['Relajación', 'Digestión'],
  },
];

const categories = [
  { id: 'superfoods', name: 'Superfoods' },
  { id: 'aceites', name: 'Aceites' },
  { id: 'capsulas', name: 'Cápsulas' },
  { id: 'infusiones', name: 'Infusiones' },
  { id: 'miel', name: 'Miel' },
];
const orders = [];
const users = [
  { id: 1, name: 'Usuario de Prueba', email: 'test@example.com', password: 'password123' },
];

app.get('/api/products', (req, res) => {
  const category = req.query.category;

  const result =
    category && category !== 'todos'
      ? products.filter(product => product.category === category)
      : products;

  res.json(result);
});

app.get('/api/products/search', (req, res) => {
  const q = (req.query.q || '').toLowerCase();
  const result = products.filter(
    (product) =>
      product.name.toLowerCase().includes(q) ||
      product.description.toLowerCase().includes(q)
  );
  res.json(result);
});

app.get('/api/products/:id', (req, res) => {
  const product = products.find((item) => item.id === Number(req.params.id));
  if (!product) {
    return res.status(404).json({ message: 'Producto no encontrado' });
  }
  res.json(product);
});

app.get('/api/categories', (req, res) => {
  res.json(categories);
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(
    (item) => item.email === email && item.password === password
  );

  if (!user) {
    return res.status(401).json({ message: 'Credenciales inválidas' });
  }

  res.json({
    token: 'fake-jwt-token',
    user: { name: user.name, email: user.email },
  });
});

app.post('/api/orders', (req, res) => {
  const orderData = req.body;
  const order = {
    id: orders.length + 1,
    ...orderData,
    createdAt: new Date().toISOString(),
  };
  orders.push(order);
  res.status(201).json(order);
});

app.get('/api/orders', (req, res) => {
  res.json(orders);
});

app.get('/api/orders/:id', (req, res) => {
  const order = orders.find((item) => item.id === Number(req.params.id));
  if (!order) {
    return res.status(404).json({ message: 'Pedido no encontrado' });
  }
  res.json(order);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});
```

### 2.1. Carpeta "components"

- **CartItemRow.js**: Componente de cada producto que es añadido al carrito de compras. Incluye los precios de los productos y puede aumentar o reducir la cantidad de dicho producto. Además tiene la opción de eliminarse el producto y reemplazarlo por otro.

```
return (
  <View style={containerStyle}>
    <Text style={titleStyle}>
      Mi Carrito ({safeItems.length} items)
    </Text>

    {error ? (
      <Text style={errorStyle}>{error}</Text>
    ) : (
      <FlatList
        data={safeItems}
        keyExtractor={item =>
          item.productId.toString()}
        renderItem={({ item }) => (
          <CartItemRow
            item={item}
            onIncrease={() =>
              updateQuantity(
                item.productId,
                item.quantity + 1)}
            onDecrease={() =>
              updateQuantity(
                item.productId,
                item.quantity - 1)}
            onRemove={() =>
              removeItem(item.productId)}
          />
        )}
        ListEmptyComponent={
          <Text style={emptyStyle}>
            Tu carrito está vacío
          </Text>}
      />
    )}

    {safeItems.length > 0 && (
      <View style={styles.footer}>
        <TextInput
          style={inputStyle}
          placeholder='Dirección de entrega'
          placeholderTextColor={theme.placeholder}
          value={address}
          onChangeText={setAddress}
        />
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>
            Total:</Text>
          <Text style={styles.totalValue}>
            S/ {safeTotal.toFixed(2)}</Text>
        </View>
        <TouchableOpacity
          style={styles.checkoutBtn}
          onPress={handleCheckout}>
          <Text style={styles.checkoutText}>
            Realizar Pedido</Text>
        </TouchableOpacity>
      </View>
    )}
  </View>
);
```

- **CategoryChip.js**: Componente con el que se selecciona productos en base a su categoría (Todos, Superfood, Aceites, Cápsulas, Infusiones, Miel). Van después de la barra de búsqueda.

```
export default function CategoryChip({ label, active, onPress }) {
  const { theme } = useTheme();
	return (
		<TouchableOpacity
			style={[
				styles.chip,
				{ backgroundColor: theme.card, borderColor: theme.border },
				active && { backgroundColor: theme.accent, borderColor: theme.accent },
			]}
			onPress={onPress}
		>
			<Text style={[
				styles.text,
				{ color: active ? '#FFFFFF' : theme.text },
			]}>
				{label}
			</Text>
		</TouchableOpacity>
	);
}
```

### 2.2. Carpeta "models"

- **Orders.js**: Estructura de un pedido realizado por el usuario. Contiene datos como la lista de productos, el precio total, el estado (pendiente, procesando, etc.) y la fecha de creación del pedido.

```
// Modelo que representa un pedido completado
export default class Order {
  constructor({ id, items, total, status, date,
                address }) {
    this.id = id;
    this.items = items || [];     // Lista de CartItems
    this.total = total;           // Monto total
    this.status = status || 'Pendiente'; // Estado del pedido
    this.date = date || new Date().toISOString();
    this.address = address || '';
  }

  static fromJSON(json) {
    return new Order(json);
  }

  getFormattedDate() {
    return new Date(this.date).toLocaleDateString('es-PE');
  }

  getStatusColor() {
    const colors = {
      Pendiente: '#F39C12',
      Procesando: '#3498DB',
      Enviado: '#8E44AD',
      Entregado: '#27AE60',
    };
    return colors[this.status] || '#95A5A6';
  }
}
```

### 2.3. Carpeta "services"

- **EventBus.js**: Autobús de eventos, permite que diferentes partes de una aplicación se comuniquen entre sí sin estar acopladas directamente.

```
// Simple event bus for cross-component communication
const listeners = {};

export default {
  on(event, cb) {
    if (!listeners[event]) listeners[event] = [];
    listeners[event].push(cb);
    return () => this.off(event, cb);
  },
  off(event, cb) {
    if (!listeners[event]) return;
    listeners[event] = listeners[event].filter(l => l !== cb);
  },
  emit(event, payload) {
    (listeners[event] || []).forEach(cb => {
      try { cb(payload); } catch (e) { console.error('EventBus handler error', e); }
    });
  }
};
```

- **ThemeContext.js**: Contexto para aplicar el modo oscuro en toda la aplicación y viceversa. Incluye darle un estilo nuevo a cada componente

```
export function ThemeProvider({ children }) {
     const [dark, setDark] = useState(false);

     useEffect(() => {
          let mounted = true;
          StorageService.isDarkTheme().then(v => {
               if (mounted) setDark(!!v);
          }).catch(() => {});
          return () => { mounted = false; };
     }, []);

     const toggle = useCallback(() => {
          setDark(prev => {
               const newValue = !prev;
               StorageService.setDarkTheme(newValue).catch(console.error);
               return newValue;
          });
     }, []);

     const theme = dark ? darkTheme : lightTheme;

     return (
          <ThemeContext.Provider value={{ dark, theme, toggle }}>
               {children}
          </ThemeContext.Provider>
     );
}

export function useTheme() {
     return useContext(ThemeContext);
}

export default ThemeContext;
```

# NaturaApp - Firebase (Sem 12)

Incluye autenticación en Firebase mediante la colección "users" y gestión de elementos como colección de productos ("products") y categorías ("categories"). Luego de agregar las credenciales del proyecto de Firebase, estos son los cambios que se hizo para manejar el proceso de compra.

## 1. firestoreService.js

Se cambió el nombre de algunos de los atributos de los objetos, entre ellos:

- userId -> id (para indicar los pedidos de acuerdo al ID del usuario)

- isActive -> active (si el producto se encuentra disponible en el inventario)

- **OrderService.create**: Se le agrega un valor alternativo para cada elemento, en caso reciba "undefined". Por ejemplo, items recibe una cadena vacía, el total vale cero, y en la dirección aparezca como "Sin dirección".

- **getByUser**: Se inserta mensajes de debug para la obtención de los pedidos por ID, donde hace un conteo de los elementos, y posee un manejo de errores en caso la base de datos no responda.

```
// Crear pedido
  create: async (userId, orderData) => {
  // Queremos ver si el addDoc falla.
    console.log('Intentando guardar en Firestore...', { userId, orderData });
    
    const docRef = await addDoc(collection(db, 'orders'), {
      userId,
      items: orderData.items || [],
      total: orderData.total || 0,
      shippingAddress: orderData.shippingAddress || 'Sin dirección',
      paymentMethod: orderData.paymentMethod || 'cash',
      status: 'pending',
      createdAt: serverTimestamp(),
    });
  
    console.log('¡ÉXITO! Documento creado con ID:', docRef.id);
    return { id: docRef.id, ...orderData };
},

// Obtener pedidos del usuario
getByUser: async (userId) => {
  try {
    const q = query(
      collection(db, 'orders'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const snapshot = await getDocs(q);
    
    // LOG DE SEGURIDAD
    console.log('DEBUG: ¿Existen documentos en la colección orders?');
    const allDocs = await getDocs(collection(db, 'orders'));
    console.log('DEBUG: Total de documentos en toda la colección orders:', allDocs.size);
    
    const results = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    return results;
  } catch (err) {
    console.error('ERROR EN QUERY:', err); // ¡Esto mostrará el error real!
    return [];
  }
}
```

## 2. useCart.js

- **loadCart**: Se usa una condicional como modo de seguridad solo en el caso de que la base de datos devuelva la información esperada. Si es positiva y a la vez es un arreglo, ejecuta la función setItems. Caso contrario, marca el error y anula la entrada del producto al carrito, indicando cuál es el nombre/tipo de producto, y la cantidad de cada producto.

```
const loadCart = useCallback(async () => {
  if (!userId) return;
  setLoading(true);
  try {
    const data = await CartService.get(userId);
    
    // Seguridad:
    if (data && Array.isArray(data.items)) {
      setItems(data.items);
    }
    else {
      console.warn('El formato de datos no es el esperado', data);
      setItems([]);
    }

    // Log para verificar en terminal si hay productos en el carrito
    console.log('useCart.loadCart — userId:', userId, 'items:', data.items);
  } catch (err) {
    console.error('Error cargando carrito:', err);
    setError('No se pudo cargar el carrito');
  } finally {
    setLoading(false);
  }
}, [userId]);
```

- **addItem**: Se maneja el estado de la pantalla actualizándo los datos existentes con los nuevos. 
```
// Actualizar pantalla antes de llamar a Firebase
setItems((prevItems) => {
  const existingItem = prevItems.find(item => item.id === product.id);
  if (existingItem) {
    return prevItems.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1} : item);
  }
  return [...prevItems, {...product, quantity: 1}];
});
```

## useOrders.js

- **createOrders**: Se le aplica una actualización optimista, esto significa actualizar la interfaz inmediatamente antes de que el servidor confirme el cambio, para que la aplicación se sienta más rápida. Se consigue mediante un pedido temporal, donde si Firestore cambia, se puede revetir el cambio del prducto.
