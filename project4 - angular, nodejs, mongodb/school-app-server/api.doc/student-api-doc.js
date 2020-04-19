[
    {
        "id": 0,
        "des": "Get Students List",
        "method": "GET",
        "path": "/student",
        "req": null,
        "res":
            [
                {
                    "_id": "string",
                    "name": "string",
                    "phone": "string",
                    "email": "string",
                    "image": "string",
                    "courses": [
                        {
                            "_id": "string",
                            "name": "string",
                            "image": "string"
                        }
                    ]
                },
            ]
    },
    {
        "id": 1,
        "des": "Get Single Student Info",
        "method": "GET",
        "path": "/student/:id",
        "req": {
            "_id": "string"
        },
        "res":

        {
            "_id": "string",
            "name": "string",
            "phone": "string",
            "email": "string",
            "image": "string",
            "courses": [
                {
                    "_id": "string",
                    "name": "string",
                    "image": "string"
                }
            ]
        },

    },
    {
        "id": 2,
        "des": "Create New Student",
        "method": "POST",
        "path": "/student",
        "req": {
            "name": "string",
            "phone": "string",
            "email": "string",
            "image": "string",
            "courses": [
                {
                    "_id": "string",
                    "name": "string",
                    "image": "string",
                },
            ]
        },
        "res": {
            "_id": "string",
            "name": "string",
            "phone": "string",
            "email": "string",
            "image": "string",
            "courses": [
                {
                    "_id": "string",
                    "name": "string",
                    "image": "string"
                }
            ]
        }
    },
    {
        "id": 3,
        "des": "Update Student",
        "method": "PUT",
        "path": "/student",
        "req": {
            "old": {
                "_id": "string",
                "name": "string",
                "phone": "string",
                "email": "string",
                "image": "string",
                "courses": [
                    {
                        "_id": "string",
                        "name": "string",
                        "image": "string",
                    },
                ]
            },
            "new": {
                "_id": "string",
                "name": "string",
                "phone": "string",
                "email": "string",
                "image": "string",
                "courses": [
                    {
                        "_id": "string",
                        "name": "string",
                        "image": "string",
                    },
                ]
            }
        },
        "res": {
            "_id": "string",
            "name": "string",
            "phone": "string",
            "email": "string",
            "image": "string",
            "courses": [
                {
                    "_id": "string",
                    "name": "string",
                    "image": "string",
                }
            ]
        }
    },
    {
        "id": 4,
        "des": "Delete Student",
        "method": "DELETE",
        "path": "/student/:id",
        "req": {
            "_id": "string",
        },
        "res": {
            "_id": "string",
        }
    },
    {
        "id": 5,
        "des": "Add Student Image",
        "method": "POST",
        "path": "/student/images",
        "req": {
            "imgFile": "(binary)",
        },
        "res": {
            "fileName": "string"
        }
    },
    {
        "id": 6,
        "des": "Delete Student Image",
        "method": "DELETE",
        "path": "/student/images/:imgName",
        "req": {
            "imageName": "string"
        },
        "res": {
            "isDeleted": true
        }
    },
]