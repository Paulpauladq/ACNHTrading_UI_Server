import serialize from 'serialize-javascript';

export default function template(body, initialData, userData) {
  return `<!DOCTYPE HTML>
<html>

<head>
  <meta charset="utf-8">
  <title>ACNH Trading</title>
  <link rel="stylesheet" href="/bootstrap/css/bootstrap.min.css" >
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  
  <script src="https://apis.google.com/js/api:client.js"></script>
  <script src="https://kit.fontawesome.com/a230387ecb.js" crossorigin="anonymous"></script>
  <script src="https://code.iconify.design/1/1.0.7/iconify.min.js"></script>
  <link href="https://fonts.googleapis.com/css2?family=Baloo+Tamma+2:wght@600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.8.1/css/all.css" integrity="sha384-50oBUHEmvpQ+1lW4y57PTFmhCaXp0ML5d60M1M7uH2+nqUivzIebhndOJK28anvf" crossorigin="anonymous">
  <style>
    table.table-hover tr {cursor: pointer;}
    .panel > .panel-heading {
        background-color: #01DFA5;
        color: white;
        border-color: #01DFA5;
    }
    
    .panel-body, .panel-footer, .panel-heading, .btn, .nav-tabs {
        font-family: 'Baloo Tamma 2', cursive;
        font-size: 15px;
        font-weight: bold;
    }
    
   .panel {
        border-color: #01DFA5;
    }
    
    .panel-footer {
        color: #01DFA5
    }

    .panel-empty .panel-heading{
        border: 1px solid #dddddd;
        -webkit-box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
        box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
    }
    
    .jumbotron {
        font-family: 'Baloo Tamma 2', cursive;
        font-weight: bold;
    }
    
    #ProductImg{
        background-image: url(https://i.redd.it/y5mzeig307b41.png);
        background-size: cover;
        background-position: center;
        background-repeat: repeat;
        width: 100%;
        height: 100%;
    }

    #profile-panel-body{
        background-color: #01DFA5
    }
    
    #listing-detail-button, #profile-edit-btn {
        background-color:  #01DFA5;
        border: #01DFA5;
    }

    .navbar {
        background-image: url(https://wallpaperaccess.com/full/2317617.jpg);
        background-size: cover;
        background-position: center;
        background-repeat: repeat;
        font-family: 'Baloo Tamma 2', cursive;
        font-size: 15px;
        font-weight: bold;
    }
    
    .pagination > li > a.active {
        background-color: #01DFA5;
        color: white;
    }

    .pagination > li > a:hover:not(.active) {background-color: darkgrey;}
    
    #home-nav-item, #user-email, #user-dropdown {
        color: #01DFA5;
    }
    
    #category-button-toolbar > .btn  {
        color: darkgrey;
    }
    
    #listing-panel-body {
        color: darkgrey;
    }
    
    #brand-nav-item {
        color: #01DFA5;
        font-size: 18px;
    }

    #user-email :hover{
        color: grey;
    }
  </style>
</head>

<body>
  <!-- Page generated from template. -->
  <div id="contents">${body}</div>
  <script>
    window.__INITIAL_DATA__ = ${serialize(initialData)}
    window.__USER_DATA__ = ${serialize(userData)}
  </script>
    
  <script src="/env.js"></script>
  <script src="/vendor.bundle.js"></script> 
  <script src="/app.bundle.js"></script>
</body>

</html>
`;
}
