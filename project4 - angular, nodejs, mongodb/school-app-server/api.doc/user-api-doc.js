[
    {
        "id": 0,
        "des": "Get Users List",
        "method": "GET",
        "path": "/user",
        "req": '',
        "res": {
            "Response": [
                {
                    "_id": "string",
                    "name": "string",
                    "role": "string",
                    "phone": "string",
                    "email": "string",
                    "image": "string"
                }]
        }
    },
    {
        "id": 1,
        "des": "Get Single User Info",
        "method": "GET",
        "path": "/user/:id",
        "req": {
            "Request": {
                "id": "string"
            }
        },
        "res": {
            "Response": {
                "_id": "string",
                "name": "string",
                "role": "string",
                "phone": "string",
                "email": "string",
                "image": "string"
            }
        }
    },
    {
        "id": 2,
        "des": "Login and User Validation",
        "method": "POST",
        "path": "/user/login",
        "req": {
            "Request": {
                "email": "string",
                "password": "string",
            }
        },
        "res": {
            "Response": {
                "_id": "string",
                "name": "string",
                "role": "string",
                "image": "string",
                "token": "string"
            }
        }
    },
    {
        "id": 3,
        "des": "Create New User",
        "method": "POST",
        "path": "/user/register",
        "req": {
            "Request": {
                "name": "string",
                "phone": "string",
                "email": "string",
                "role": "string",
                "image": "string",
                "password": "string"
            }
        },
        "res": {
            "Response": {
                "_id": "string",
                "name": "string",
                "role": "string",
                "phone": "string",
                "email": "string",
                "image": "string"
            }
        }
    },
    {
        "id": 4,
        "des": "Update User",
        "method": "PUT",
        "path": "/user",
        "req": {
            "Request": {
                "_id": "string",
                "name": "string",
                "role": "string",
                "phone": "string",
                "email": "string",
                "image": "string",
            }
        },
        "res": {
            "Response": {
                "_id": "string",
                "name": "string",
                "role": "string",
                "phone": "string",
                "email": "string",
                "image": "string"
            }
        }
    },
    {
        "id": 5,
        "des": "Delete User",
        "method": "DELETE",
        "path": "/user/:id",
        "req": {
            "Request": {
                "_id": "string",
            }
        },
        "res": {
            "Response": {
                "_id": "string",
            }
        }
    },
    {
        "id": 6,
        "des": "Add User Image",
        "method": "POST",
        "path": "/user/images",
        "req": {
            "Request": {
                "imgFile": "(binary)",
            }
        },
        "res": {
            "Response": {
                "fileName": "string"
            }
        }
    },
    {
        "id": 7,
        "des": "Delete User Image",
        "method": "DELETE",
        "path": "/user/images/:imgName",
        "req": {
            "Request": {
                "imageName": "string"
            }
        },
        "res": {
            "Response": {
                "isDeleted": true
            }
        }
    },
]

