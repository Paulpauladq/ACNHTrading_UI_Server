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
  <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.8.1/css/all.css" integrity="sha384-50oBUHEmvpQ+1lW4y57PTFmhCaXp0ML5d60M1M7uH2+nqUivzIebhndOJK28anvf" crossorigin="anonymous">
  <style>
    table.table-hover tr {cursor: pointer;}
    .panel-title a {display: block; width: 100%; cursor: pointer;}
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
