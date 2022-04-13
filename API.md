| **Method** | **Endpoint**   | **Function**             | **Req.Body**  |
|--------|------------|----------------------|---|
| Post   | /users     | Create a User        | {<br>"username": "Get",<br>"Endpoint": "/posts",<br>"Function": "Get All Posts ",<br>"null": null<br>}  |
| Get    | /users     | Get All Users        |   |
| Get    | /users/:id | Get a single User     |   |
| Put    | /users/:id | Update a single User  |   |
| Delete | /users/:id | Delete a single User  |   |
| Get    | /posts               | Get All Posts                                             |   |
| Get    | /posts/:id           | Get single Posts                                          |   |
| Put    | /posts/:id           | Update single Posts                                       |   |
| Delete | /posts/:id           | Delete single Posts                                       |   |
| Get    | /posts/:author       | Get All Posts from a single user from all communities     |   |
| Get    | /posts/:community_id | Get All Posts from a single user from a single community  |   |
| Get    | /posts/              | Get All Posts from a single community                     |   |
