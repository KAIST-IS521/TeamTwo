# TeamTwo Shopping Mall
We developed shopping mall service by using `MySQL`, `GnuPG`, and `Express` framework on `Node.js`.

## Intro

Our shopping mall is web service, so we expect you can easily figure out how to use without any comment.
The following screen shot will be helpful to understand our service.

## How to Use
### Download the source code and build it.
```
git clone https://github.com/KAIST-IS521/TeamTwo.git
cd TeamTwo
make
```

### Use your web browser to access our service.


## Menus

Navigation var includes the all menus such as shopping cart, order, sign-up, login, logout, mypage, etc. But, before log-in, some menus like shopping cart, order and mypage are hiden.

### List of items & Search

Main page includes list of items and search UI. If you push the detail button, you can add the item to the shopping cart or buy it.

![main](./README_img/main.png)

![product](./README_img/product.png)

![detail](./README_img/detail.png)


### Sign-up

We support PGP-based authentication. If you write your GitHub ID and push the request button, you can get the encpryted text. Then you decrypt it with your private key and you have to encryt it with our public key. And you paste the encrypted text in the text area field.

![register](./README_img/register.png)


### Log-in page

After sign-up, you can login with ID, PW.

![login](./README_img/login.png)


### Shopping cart

This shopping cart page shows your choosen items. If you push order button, you can buy it.

![shopping cart](./README_img/cart.png)


### View Order

You can see the purchased item in order page.

![order](./README_img/order.png)


### Message to admin

You can send a message to the admin and see the sent messages in mypage.

![mypage](./README_img/mypage.png)