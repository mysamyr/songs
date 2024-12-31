# Пісенник (+ текст літургії й панахиди)

## Stack

- express
- MongoDB

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
- delete account
- admin accounts

## Pages

- index `/`
- text `/lit, /pan`
- auth `/auth`
- cabinet `/cabinet`
- categories `/category`
- category `/category/:id`
- new_category `/category/add`
- song `/song/:id`
- new_song `/song/add`
- edit_song `/song/:id/edit`
- 404

## TODO

- finish implementing client
- clean css
- edit `README.md`
- add search
- add sidebar
- header-container to flex