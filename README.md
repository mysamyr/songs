# Пісенник (+ текст літургії і панахиди)

## Stack
- express
- MongoDB
- handlebars

## Features
- Possibility to change category`s name, username - admin
- User:
  - auth
  - verify
  - resend verification message
  - change email/password
  - create new category (unique)
  - delete empty category
  - create new song (unique song name)
  - edit own song (assign/unbind categories)
  - delete own song
  - delete account ?

## Pages
- index    `/`
- text    `/lit, /pan`
- auth    `/auth`
- cabinet    `/cabinet`
- categories    `/category`
- category    `/category/:id`
- new_category    `/category/add`
- song    `/song/:id`
- new_song    `/song/add`
- edit_song    `/song/edit/:id`
- 404

## Problems
- категорії в бд зберігаються нижнім регістром, на клієнті - capitalize

## TODOs
- додати токен в storage