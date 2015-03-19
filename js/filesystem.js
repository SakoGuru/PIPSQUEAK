//(c) Scott G Gavin, PIPSQUEAK - 01/28/2015
/*jslint node: true */


var pip = (function() {
//this probably needs to be namespaced before too long, prevent collisions
    var http = require('http'),
            fs = require('fs'),
            pub = {};
    //this function prints the indicated directory, indicates items within a directory under the directory's name and leveled with 4 spaces
    pub.printDir = function(directory, level, out) {
        "use strict";
        var files,
            i,
            ii;

        //make sure all inputs are assigned an initial variable. Defaults to local directory.
        directory = directory == null ? "." : directory;
        level = level == null ? 0 : level;
        out = out == null ? [] : out;
        files = fs.readdirSync(directory);
        for (i = 0; i < files.length; i += 1) {
            for (ii = 0; ii < level; ii += 1) {
                out.push("    ");
            }
            if (fs.lstatSync(directory + "/" + files[i]).isDirectory()) {
                out.push(files[i] + "\n");
                out = printDir((directory + "/" + files[i]), level + 1, out);
            } else {
                out.push(files[i] + "\n");
            }
        }
        return out;
    }

    //reads out the contents of a file as a string
    pub.readFile = function(location) {
        "use strict";
        return fs.readFileSync(location, 'ascii');
    }

    pub.copyFile = function(location, destination)  {
        "use strict";
        fs.createReadStream(location).pipe(fs.createWriteStream(destination));
        return true;
    }
    //write the string contents of a file. can use different encoding types, like UTF8.
    pub.writeFile = function(location, contents) {
        "use strict";
        contents = contents == null ? "File generated by PIPSQUEAK\n" : contents;
        //throw an error if the file exists for now.
        if (fs.existsSync(location)) {
            throw "File already exists";
        }
        fs.writeFileSync(location, contents, 'ascii');
        return true;
    }

    pub.doesExist = function(directory) {
        return fs.existsSync(directory);
    };
    //if theres no overwrite, make the directory. otherwise throw an error
    function makeDirectory(location) {
        "use strict";
        var permissions = '0777';
        //need to make sure the selected directory wont overwrite a file too
        if (fs.existsSync(location)) {
            throw "Directory already exists";
        }
        fs.mkdirSync(location, permissions);
        return true;
    }

    //takes a filename and an optional directory, returns an array with whether the file was found and the local filepath
    function findFile(fileName, dir) {
        "use strict";
        var filePath = [false, "No file found"],
            files,
            i;
        if (fileName == null) {
            throw "No filename input";
        }
        //if dir is not defined assign it the local scope, otherwise leave it alone
        dir = dir == null ? "." : dir;
        files = fs.readdirSync(dir);
        for (i = 0; i < files.length; i += 1) {
            if (fs.lstatSync(dir + "/" + files[i]).isDirectory()) {
                filePath = findFile(fileName, (dir + "/" + files[i]));
                if (filePath[0] === true) {
                    return filePath;
                }
            } else {
                if (fileName === files[i]) {
                    return [true, dir + "/" + files[i]];
                }
            }
        }
        return filePath;
    }



    //removes a file if it exists
    pub.removeFile = function(location) {
        "use strict";
        fs.unlinkSync(location);
        return true;
    }

    //removes a directory if it exists
    function removeDirectory(location) {
        "use strict";
        //needs to descend into its directory and delete files.  or not, maybe. Depends on if we want it to delete the whole directory and everything in it, or be safer and only kill directories.
        fs.rmdirSync(location);
        return true;
    }

    //entry point to removal
    function remove(location) {
        "use strict";
        if (!(fs.existsSync(location))) {
            return false;
        }
        //if its a file, call remove file
        if (fs.lstatSync(location).isFile()) {
            removeFile(location);
        } else {
            //if its a directory call remove directory
            removeDirectory(location);
        }
    }

    //function that will initialize the PIPSQUEAK location if it doesn't already exist.
    //location variable to allow us to eventually maybe let the user et where they want the working directory
    pub.initialize = function(name,location) {
        "use strict";
        //set default location
        location = location == null ? "." : location;
        name = name == null ? "publish" : name;
        if (fs.existsSync(location + "/" + name)) {
            return false;
        }
        //make PIPSQUEAK directory
        makeDirectory(location + "/" + name);
        //main folder is html
        //js, css folders
        makeDirectory(location + "/"  + name + "/js");
        makeDirectory(location + "/" + name + "/css");
        //assets folder
        makeDirectory(location + "/"  + name + "/assets");
        //subfolders - audio, video, images?
        makeDirectory(location + "/"  + name + "/assets/video");
        makeDirectory(location + "/"  + name + "/assets/audio");
        makeDirectory(location + "/"  + name + "/assets/images");
        return true;
    }
    return pub;
}());
