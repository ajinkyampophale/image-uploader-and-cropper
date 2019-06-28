function check_file(input, allowed, size, type) {

    var error;
    var error_display;

    if (size != '' && type == 'mb') {
        bytes_size = size * 1048576;  //size from mb to bytes
    }
    else if (size != '' && type == 'kb') {
        bytes_size = size * 1024;  //size from kb to bytes
    }

    if ('files' in input) {

        if (input.files.length == 0) {
            error_display = 'Please select a file.';
            error = [false, error_display];
            return error;
        }
        else {

            var file = input.files[0];

            var temp = file.name.split(".");

            var temp2 = 0;

            temp.forEach(function (element) {

                element = element.toLowerCase();

                if (in_array(element, allowed)) {
                    temp2 = 1;
                }

            });

            if (temp2 == 0) {

                error_display = 'Only ';

                allowed.forEach(function (element) {
                    error_display += element + ' ';
                });

                error_display += 'files allowed.'

                return [false, error_display];
            }
            else if (size != '') {

                if (file.size > bytes_size) {
                    return [false, `File size cannot be greater than ${size} ${type}`];
                }
                else {
                    return [true, 'valid'];
                }
            }
        }
    }
}


function in_array(input, array) {

    var i;
    var flag = 0;

    for (i = 0; i < array.length; i++) {

        if (array[i] == input) {
            flag = 1;
            break;
        }

    }

    if (flag == 1) {
        return true;
    }
    else {
        return false;
    }

}

