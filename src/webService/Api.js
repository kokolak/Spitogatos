import React from 'react'
import $ from 'jquery'

export default class Api extends React.Component {

    constructor(props, context) {
        super(props, context);
    }

    /**
         * Performs a call at the backend service
         * @param {String} uri
         * @param {String} method GET,POST, PUT
         * @param {Instance} callback
         * @param {Object} data data to send
         */
    static call(uri, method, callback = null, statusRes = null, data = {}) {
        //console.log(uri)
        $.ajax({
            url: uri,
            dataType: 'json',
            cache: false,
            method: method,
            contentType: "application/json; charset=utf-8",
            data: data,
            xhrFields: {
                withCredentials: true
            },
            success: function (data) {
                if (callback !== null) {
                    if (typeof callback !== "function") {
                        console.error("Api call error: passed callback is not a function instance");
                    }
                    else {
                        callback(data);
                    }
                }
            },
            error: (xhr, status, err) => {
                console.log(xhr.responseText)
                console.log(xhr.status)
            }
        });
    }

}