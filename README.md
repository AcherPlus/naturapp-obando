# NaturaApp

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