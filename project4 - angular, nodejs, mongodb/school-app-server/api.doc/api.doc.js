"use strict";
// TODO: delete json files;

const SERVER_BASE_URL = 'http://localhost:5000';
const CONTROLLERS = {
    users: 'USERS',
    students: "STUDENTS",
    courses: "COURSES"
}
const userApi = [
    {
        "id": 0,
        "des": "Get Users List",
        "method": "GET",
        "path": "/user",
        "req": '',
        "res": `
    [
        {
            "_id": "string",
            "name": "string",
            "role": "string",
            "phone": "string",
            "email": "string",
            "image": "string"
        }
    ]`
    },
    {
        "id": 1,
        "des": "Get Single User Info",
        "method": "GET",
        "path": "/user/:id",
        "req": `
    {
        "id": "string"
    }`,
        "res": `
    {
        "_id": "string",
        "name": "string",
        "role": "string",
        "phone": "string",
        "email": "string",
        "image": "string"
    }`
    },
    {
        "id": 2,
        "des": "Login and User Validation",
        "method": "POST",
        "path": "/user/login",
        "req": `
    {
        "email": "string",
        "password": "string",
    }`,
        "res": `
    {
        "_id": "string",
        "name": "string",
        "role": "string",
        "image": "string",
        "token": "string"
    }`
    },
    {
        "id": 3,
        "des": "Create New User",
        "method": "GET",
        "path": "/user/register",
        "req": `
    {
        "name": "string",
        "phone": "string",
        "email": "string",
        "role": "string",
        "image": "string",
        "password": "string"
    }`,
        "res": `
    {
        "_id": "string",
        "name": "string",
        "role": "string",
        "phone": "string",
        "email": "string",
        "image": "string"
    }`
    },
    {
        "id": 4,
        "des": "Update User",
        "method": "PUT",
        "path": "/user",
        "req": `
    {
        "_id": "string",
        "name": "string",
        "role": "string",
        "phone": "string",
        "email": "string",
        "image": "string",
    }`,
        "res": `
    {
        "_id": "string",
        "name": "string",
        "role": "string",
        "phone": "string",
        "email": "string",
        "image": "string"
    }`
    },
    {
        "id": 5,
        "des": "Delete User",
        "method": "DELETE",
        "path": "/user/:id",
        "req": `
    {
        "_id": "string",
    }`,
        "res": `
    {
        "_id": "string",
    }`
    },
    {
        "id": 6,
        "des": "Add User Image",
        "method": "POST",
        "path": "/user/images",
        "req": `
    {
        "imgFile": "(binary)",
    }`,
        "res": `
    {
        "fileName": "string"
    }`
    },
    {
        "id": 7,
        "des": "Delete User Image",
        "method": "DELETE",
        "path": "/user/images/:imgName",
        "req": `
    {
        "imageName": "string"
    }`,
        "res": `
    {
        "isDeleted": true
    }`
    },
]
const studentApi = [
    {
        "id": 0,
        "des": "Get Students List",
        "method": "GET",
        "path": "/student",
        "req": null,
        "res":
            `[
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
    ]`
    },
    {
        "id": 1,
        "des": "Get Single Student Info",
        "method": "GET",
        "path": "/student/:id",
        "req":
            `{
        "_id": "string"
    }`,
        "res":
            `{
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
    }`
    },
    {
        "id": 2,
        "des": "Create New Student",
        "method": "POST",
        "path": "/student",
        "req":
            `{
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
    }`,
        "res":
            `{
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
    }`
    },
    {
        "id": 3,
        "des": "Update Student",
        "method": "PUT",
        "path": "/student",
        "req":
            `{
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
    }`,
        "res":
            `{
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
    }`
    },
    {
        "id": 4,
        "des": "Delete Student",
        "method": "DELETE",
        "path": "/student/:id",
        "req":
            `{
        "_id": "string",
    }`,
        "res":
            `{
        "_id": "string",
    }`
    },
    {
        "id": 5,
        "des": "Add Student Image",
        "method": "POST",
        "path": "/student/images",
        "req":
            `{
        "imgFile": "(binary)",
    }`,
        "res":
            `{
        "fileName": "string"
    }`
    },
    {
        "id": 6,
        "des": "Delete Student Image",
        "method": "DELETE",
        "path": "/student/images/:imgName",
        "req":
            `{
        "imageName": "string"
    }`,
        "res":
            `{
        "isDeleted": true
    }`
    },
]
const courseApi = [
    {
        "id": 0,
        "des": "Get Courses List",
        "method": "GET",
        "path": "/course",
        "req": null,
        "res":
            `[
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
    ]`
    },
    {
        "id": 1,
        "des": "Get Single Course Info",
        "method": "GET",
        "path": "/course/:id",
        "req":
            `{
        "_id": "string"
    }`,
        "res":
            `{
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
    }`
    },
    {
        "id": 2,
        "des": "Create New Course",
        "method": "POST",
        "path": "/course",
        "req":
            `{
        "name": "string",
        "description": "string",
        "image": "string",
        "courseStudents": []
    }`,
        "res":
            `{
        "_id": "string",
        "name": "string",
        "description": "string",
        "image": "string",
        "courseStudents": []
    }`
    },
    {
        "id": 3,
        "des": "Update Course",
        "method": "PUT",
        "path": "/course",
        "req":
            `{
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
    }`,
        "res":
            `{
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
    }`
    },
    {
        "id": 4,
        "des": "Delete Course",
        "method": "DELETE",
        "path": "/course/:id",
        "req":
            `{
        "_id": "string",
    }`,
        "res":
            `{
        "_id": "string",
    }`
    },
    {
        "id": 5,
        "des": "Add Course Image",
        "method": "POST",
        "path": "/course/images",
        "req":
            `{
        "imgFile": "(binary)",
    }`,
        "res":
            `{
        "fileName": "string"
    }`
    },
    {
        "id": 6,
        "des": "Delete Course Image",
        "method": "DELETE",
        "path": "/course/images/:imgName",
        "req":
            `{
        "imageName": "string"
    }`,
        "res":
            `{
        "isDeleted": true
    }`
    },
];

let template = `
        <div>Base Api Endpoint: <b>${SERVER_BASE_URL}</b></div>
        <br>
        <table>
            <thead>
                <tr>
                    <th>Description</th>
                    <th>Method + Path</th>
                    <th>Request/Response</th>
                </tr>
            </thead>
            <tbody id="tableBody">`
createApiDoc(CONTROLLERS.users, userApi);
createApiDoc(CONTROLLERS.students, studentApi);
createApiDoc(CONTROLLERS.courses, courseApi);

template += `</tbody>
        </table>
`

function createApiDoc(controller, array) {
    template += `
            <tr class="ctrlRow centerText">
            <td colspan="3">${controller}</td>
            </tr>
            `
    for (let i = 0; i < array.length; i++) {
        template += `
<tr>
    <td>${array[i].des}</td>
    <td>${array[i].method}
        <br>
        ${array[i].path}
    </td>
    <td>
        <pre>
Request:
    ${array[i].req}
<br>
Response:
    ${array[i].res}
        </pre>
    </td>
</tr>
`;
    }
}

$('#apiDocTable').append(template);