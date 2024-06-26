import http from 'k6/http';
import { check } from 'k6';

export let options = {
    vus: 260, 
    duration: '1s',
};

export default function () {

    const url = "http://localhost:8000/user/classify";
    const body = JSON.stringify({
        input: "the sun sets behind the mountains, casting a warm orange glow on everything",
    });
    const params = {
        headers: {
            'Content-Type': 'application/json',
            'Cookie': 'token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjZkOGRhYjE0YTU1OTkwYmViNjQ1YWEiLCJlbWFpbCI6ImdhcmltYWphdHRAZ21haWwuY29tIiwiaWF0IjoxNzE4OTU3NjkxfQ.lOVijX995i_UeaEu1v-8u1x2z-cXutUyNL_2chujQ30',
        },
    };

    const res = http.post(url, body, params);

    check(res, {
        "is status 200" : (r) => r.status === 200,
        "is res bosy has result" : (r) => {
            const jsonResponse = r.json();
            return jsonResponse.result === false;
        },
    });

}