<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>OIDC Client Sample</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
    <style>
        body {
            margin: auto;
            min-width: 700px;
        }
        pre {
            background-color: #eee;
            border: 1px solid #999;
            display: block;
            padding: 10px;
            word-wrap: break-word;
        }
        #configParams > label {
            display: block;
        }
        #configParams > label > input {
            display: block;
            width: 100%;
        }
    </style>
  </head>
  <body>
    <div class="container">
        <div class="row text-center">
            <h1>OIDC Client Sample</h1>
            <div>
                <button id="startButton" class="btn btn-primary">Start OAuth Flow</button>
                <button id="refreshButton" class="btn btn-info" style="display:none">Refresh Tokens</button>
                <button id="logoutButton" class="btn btn-danger" style="display:none">Logout</button>
                <button id="revokeButton" class="btn btn-danger" style="display:none">Revoke Token</button>
                <!--button class="btn btn-secondary" data-bs-toggle="collapse" data-bs-target="#configParams" aria-expanded="true"
                    aria-controls="configParams">Toggle Configs</button-->
            </div>
        </div>
      <div class="row m-4">
            <div class="collapse show col-5" id="configParams"></div>
            <div class="col-7" id="result"></div>
      </div>
    </div>

    <script type="text/javascript" src="script.js"></script>
  </body>
</html>
