[
    {
        "id": 0,
        "des": "Get Courses List",
        "method": "GET",
        "path": "/course",
        "req": null,
        "res": [
            {
                "_id": "string",
                "name": "string",
                "description": "string",
                "image": "string",
                "courseStudents": [
                    {
                        "_id": "string",
                        "name": "string",
                        "phone": "string",
                        "email": "string",
                        "image": "string"
                    }
                ]
            }
        ]
    },
    {
        "id": 1,
        "des": "Get Single Course Info",
        "method": "GET",
        "path": "/course/:id",
        "req": {
            "_id": "string"
        },
        "res":
        {
            "_id": "string",
            "name": "string",
            "description": "string",
            "image": "string",
            "courseStudents": [
                {
                    "_id": "string",
                    "name": "string",
                    "phone": "string",
                    "email": "string",
                    "image": "string"
                }
            ]
        }
    },
    {
        "id": 2,
        "des": "Create New Course",
        "method": "POST",
        "path": "/course",
        "req": {
            "name": "string",
            "description": "string",
            "image": "string",
            "courseStudents": []
        },
        "res": {
            "_id":"string",
            "name": "string",
            "description": "string",
            "image": "string",
            "courseStudents": []
        }
    },
    {
        "id": 3,
        "des": "Update Course",
        "method": "PUT",
        "path": "/course",
        "req": {
            "_id": "string",
            "name": "string",
            "description": "string",
            "image": "string",
            "courseStudents": [
                {
                    "_id": "string",
                    "name": "string",
                    "phone": "string",
                    "email": "string",
                    "image": "string"
                }
            ]
        },
        "res": {
            "_id": "string",
            "name": "string",
            "description": "string",
            "image": "string",
            "courseStudents": [
                {
                    "_id": "string",
                    "name": "string",
                    "phone": "string",
                    "email": "string",
                    "image": "string"
                }
            ]
        }
    },
    {
        "id": 4,
        "des": "Delete Course",
        "method": "DELETE",
        "path": "/course/:id",
        "req": {
            "_id": "string",
        },
        "res": {
            "_id": "string",
        }
    },
    {
        "id": 5,
        "des": "Add Course Image",
        "method": "POST",
        "path": "/course/images",
        "req": {
            "imgFile": "(binary)",
        },
        "res": {
            "fileName": "string"
        }
    },
    {
        "id": 6,
        "des": "Delete Course Image",
        "method": "DELETE",
        "path": "/course/images/:imgName",
        "req": {
            "imageName": "string"
        },
        "res": {
            "isDeleted": true
        }
    },
]
