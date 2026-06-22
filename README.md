# SpaceCandy

Aplicativo academico de e-commerce figurativo feito em JavaScript com Expo e React Native.

## Como rodar em desenvolvimento

Este projeto usa uma development build separada com `expo-dev-client`. Isso evita o erro de incompatibilidade quando o Expo Go da App Store ainda nao acompanha o SDK do projeto.

No Windows, abra a pasta `SpaceCandy` e execute:

```bat
start-expo.cmd
```

Ou, pelo terminal:

```bat
npm.cmd run dev
```

Depois, abra a development build instalada no celular e conecte no servidor local.

## Como gerar a development build

Primeiro, entre na sua conta Expo:

```bat
npm.cmd run eas:login
```

Para Android:

```bat
npm.cmd run build:dev:android
```

Para iOS Simulator:

```bat
npm.cmd run build:dev:ios-simulator
```

Para iPhone fisico:

```bat
npm.cmd run build:dev:ios-device
```

Build para iPhone fisico exige conta Apple Developer paga para assinatura do app.

## Expo Go

O comando abaixo ainda existe para testes rapidos, mas pode falhar se o Expo Go instalado nao suportar o SDK atual:

```bat
npm.cmd run expo-go
```

## Acessos de demonstracao

- Cliente: `cliente@spacecandy.dev` / `123456`
- Admin: `admin@spacecandy.dev` / `admin123`

## Fluxos incluidos

- Login e registro de usuario
- Lista de produtos ficticios
- Carrinho de compras
- Checkout
- Comprovante de compra
- Historico de compras
- Perfil do usuario
- Area admin com cadastro, edicao, remocao e manutencao da lista de produtos
