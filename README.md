# Пісенник (+ текст літургії і панахиди)

## Stack
- express
- MongoDB
- handlebars

## Features
- auth
- verify
- resend verification message
- change email/password
- create new category (unique)
- rename own category
- delete empty category
- create new song (unique song name)
- edit own song (select categories)
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