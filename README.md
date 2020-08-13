# GroupProject_ppttptsfzzsf_UI

## Team
* Shengfu Zhang
* Ziqi Tang

## Useful Links
* Links to API Repo: https://github.ccs.neu.edu/NEU-CS5610-SU20/GroupProject_ppttptsfzzsf_API.git
* Links to UI Repo: https://github.ccs.neu.edu/NEU-CS5610-SU20/GroupProject_ppttptsfzzsf_UI.git
* Links to Heroku Page: https://acnh-trading-ui.herokuapp.com/

## Final Iteration
* Shengfu Zhang:
    
* Ziqi Tang:
  - Add components to profile page to display the personal info and personal lisings/offers/wishlist.
  - Add profile listing component on the profile page using listing api call.
  - Add profile offer component on the profile page using offer api call.
  - Add modal to edit the profile info and re-render changes to profile page.
  - Change css to customize the elements like button, tab, grid, labels, etc. to unify the website theme.
  
## Final Delivery Snapshots and Descriptions
* Landing Page
![Home](./images/landing_page.png)

* Product Page(all categories)
![Home](./images/product_art.png)
![Home](./images/product_fossil.png)
![Home](./images/product_photo.png)
![Home](./images/product_poster.png)
![Home](./images/product_tool.png)

* Listing Page(listing post/make offers/)
![Home](./images/post_listing.png)
![Home](./images/make_offer.png)

* Profile Page(main page/edit modal/personal listing/personal offer/personal wishlist/contact via email)
![Home](./images/profile_offer.png)
![Home](./images/profile_wishlist.png)
![Home](./images/edit_profile.png)
![Home](./images/contact_me.png)


## Iteration 2 Progress
* We created components for log in and register page.
* We created components for user profile page.
* We refactored structure for components to allow avoid redundant code.
* We used POST request to store the user info into Mongo whenever a new user is logged in.
* We created authentication-aware components for profile page.

## Iterations 1 Progress
* We used book project as the boilerplate code and build our projects on top of that.
* We found the Animal Crossing New Horizon product spreadsheet dataset and use Json 
parse tool to load into the MongoDB Altas cluster.
* We created new schemas for different queries for our Animal Crossing products and the CRUD operations.
* We added new APIs for CRUD operations in our API server.
* For UI server, we added pages for our product category lists. The user profile page is still under construction.
* For product displaying pages, we add different components for different categories where the related API is called to 
load the data and render them using Grid and Panel.

## Contribution
* Shengfu Zhang: 
    1. set up Heroku server and mongoDB
    2. create MongoDB schema for query and mutation
    3. create api for querying both single product and product list
    4. create api for adding user, offer and listing
    5. create UI for product displaying page
    6. set up router for UI server
* Ziqi Tang:
    1. create api for GET both single listing and listing list
    2. create api for updating and deleting listings and offers
    3. Test and verify graphQL query and mutations on the playground
    4. generate sample data in MongoDB
    5. create components for profile page UI

## Snapshots and Descriptions
* Home Page(for now)
![Home](./images/Homepage.png)
* Sign in modal
![Home](./images/sign_in.png)
* Animal Crossing official art displaying page
![Art](./images/art_products.png)
* Animal Crossing official photos displaying page
![Photo](./images/photos_category.png)
* Animal Crossing official posters displaying page
![Poster](./images/poster_category.png)
![Poster](./images/poster_2.png)
* Animal Crossing official tools displaying page
![Tools](./images/tools.png)
* Animal Crossing official fossils displaying page
![Fossils](./images/fossils.png)


