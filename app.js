var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var express = require('express');
var methodOverride = require("method-override");
var passport = require('passport');
var localStrategy = require('passport-local');
var flash = require('connect-flash');
var User = require('./models/user');
var Item = require('./models/item');
var RC = require('./models/rc');
var InventoryRegister = require('./models/inventoryregister');
var Issue = require('./models/issue')
var app = express();

// mongoose.connect("mongodb://localhost/nhmp", { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connect("mongodb+srv://admin:admin33@cluster0.rbe1d.mongodb.net/test?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true });
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(flash())

// PASSPORT CONFIG
app.use(require('express-session')({
    secret: "secret line, don't see it!",
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});



// Item.create({
//     name: "Rifle",
//     price: 9000,
//     quantity: 7000,
//     vendorName: "Smith",
//     invoiceNo: 849823,
//     itemType: "Durable"
// })

// var newUser = new User({username: 'admin'});
//     User.register(newUser, 'admin', function(err, user){
//         if(err){
//             // res.redirect("/register");
//             console.log("Error in registering User")
//         }
//     });
// app.get("/createuser", function(req, res){
//     res.locals.title = "Create User - NHMP";
    // if(req.user.username == "manager"){
    //     res.redirect("/items");
    // }else if(req.user.username == "supervisor"){
    //     res.redirect("/supervisor");
    // }
//     res.render("createUser")
// })

// app.post("/createuser", function(req, res){
    // res.locals.title = "Create User - NHMP";
    // if(req.user.username == "manager"){
    //     res.redirect("/items");
    // }else if(req.user.username == "supervisor"){
    //     res.redirect("/supervisor");
    // }
//     var newUser = new User({username: req.body.username});
//     User.register(newUser, req.body.password, function(err, user){
//         if(err){
//             req.flash("error",  err.message);
//             res.redirect("/createuser");
//         }else{
//             req.flash("success", "Reistered successfully.");
//             res.redirect("/createuser");
//         }
//     })
// })

app.get("/createitem", isLoggedIn, function(req, res){
    res.locals.title = "Add Item - NHMP";
    if(req.user.username == "manager"){
        res.redirect("/items");
    }else if(req.user.username == "supervisor"){
        res.redirect("/supervisor");
    }
    res.render("createItem")
})

app.post("/createitem", isLoggedIn, function(req, res){
    res.locals.title = "Add Item - NHMP";
    if(req.user.username == "manager"){
        res.redirect("/items");
    }else if(req.user.username == "supervisor"){
        res.redirect("/supervisor");
    }
    console.log(req.body.name)
    var name = req.body.name;
    var price = parseInt(req.body.price);
    var quantity = parseInt(req.body.quantity);
    var vendorName = req.body.vendorName;
    var invoiceNo = parseInt(req.body.invoiceNo);
    var itemType = req.body.itemType;
    
    Item.create({
        name: name,
        price: price,
        quantity: quantity,
        vendorName: vendorName,
        invoiceNo: invoiceNo,
        itemType: itemType
    }, function (err, createdItem) {
        if(err){
            req.flash("error", "An Error occured.")
            res.redirect("/createitem")
        }else{
            req.flash("success", "Item added to Inventory Successfully.")
            res.redirect("/createitem")
        }
    })
})

app.get("/", function(req, res){
    res.redirect("/login")
})

app.get("/login", function(req, res){
    res.locals.title = "Login - NHMP";
    res.render("login")
})

app.get("/items", isLoggedIn, function(req, res){
    res.locals.title = "Dashboard - NHMP";
    if(req.user.username == "supervisor"){
        res.redirect("/supervisor");
    }
    Item.find({}, function (err, items) {
        if(err){
            console.log("Error");
        }
        else{
            res.render("index", {items: items});
        }
    })
})

app.get("/issue", isLoggedIn, function(req, res){
    res.locals.title = "Issue Item - NHMP";
    if(req.user.username == "supervisor"){
        res.redirect("/supervisor");
    }
    res.render("issue")
})

app.post("/issue", isLoggedIn, function(req, res){
    // res.send("ISSUE")
    if(req.user.username == "supervisor"){
        res.redirect("/supervisor");
    }
    res.locals.title = "Issue Item - NHMP";
    var name = req.body.item.name;
    var quantity = parseInt(req.body.item.quantity);
    var branchName = req.body.item.branchName;
    var receiverName = req.body.item.receiverName;
    var date = new Date(req.body.item.date);
    var time = req.body.item.time;
    var storeKeeperSign = req.body.item.storeKeeperSign;
    var receiverSign = req.body.item.receiverSign;

    Item.findOne({name: name}, function (err, itemFound) {
        if(err){
            // console.log("Error")
            req.flash("error", "An Error Occured.");
            // res.redirect("/issue")
        }else{
            if (itemFound == null){
                req.flash("error", "No Item exists with that name in Inventory.");
                res.redirect("/issue")
            }
            else if (quantity > itemFound.quantity){
                req.flash("error", "Item cannot be issued as there is less stock in Inventory, than you are trying to issue.");
                res.redirect("/issue")
            }
            else{
                if(req.body.item.radio1 == "option1"){
                    // console.log("First")
                    Issue.create({
                        name: name,
                        quantity: quantity,
                        branchName: branchName,
                        receiverName: receiverName,
                        date: date,
                        time: time,
                        storKeeperSign: storeKeeperSign,
                        receiverSign: receiverSign,
                        isApproved: 0
                    }, function(err, issueNew){
                        if(err){
                            // console.log(err)
                            req.flash("error", "An error occured.");
                            res.redirect("/items")
                        }else{
                            // console.log(issueNew)
                            req.flash("success", "Item will be issued after Supervisor approves the request");
                            res.redirect("/items")
                        }
                    })        
                }
                else {
                    // console.log("Second")
                    Item.findOne({name: name}, function (err, itemFound) {
                        if(err){
                            // console.log("Error")
                            req.flash("error", "An Error Occured.");
                            // res.redirect("/issue")
                        }else{
                            // console.log(itemFound)
                            RC.create({
                                itemID: itemFound._id,
                                name: name,
                                quantity: quantity,
                                branchName: branchName,
                                receiverName: receiverName,
                                date: date,
                                time: time,
                                storKeeperSign: storeKeeperSign
                            }, function(err, rc){
                                if(err){
                                    console.log("Error")
                                }else{
                                    // console.log(rc)
                                    var remain = itemFound.quantity - rc.quantity
                                    InventoryRegister.create({
                                        rcnumber: rc.id,
                                        quantityRemaining: remain,
                                        receiverName: receiverName,
                                        receiverSign: receiverSign
                                    }, function(err, IR){
                                        if(err){
                                            console.log(err)
                                        }else{
                                            // console.log(IR);
                                            itemFound.quantity = IR.quantityRemaining
                                            var newvalues = { $set: itemFound };
                                            
                                            Item.findOneAndUpdate({name: name}, newvalues, function(err, itemUpdated){
                                                if(err){
                                                    console.log(err)
                                                }else{
                                                    req.flash("success", "Item issued Successfully.");
                                                    res.redirect("/rcbook")
                                                }
                                            })
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            }
        }
    })
})

app.get("/supervisor", isLoggedIn, function(req, res){
    res.locals.title = "Permission Request - NHMP";
    if(req.user.username == "manager"){
        res.redirect("/items");
    }
    Issue.find({}, function(err, approveRequest){
        if(err){
            console.log(err)
        }else{
            res.render("requestAccept", {approveRequest: approveRequest})
        }
    })
})

app.get("/approveRequest/:id", isLoggedIn, function(req, res){
    res.locals.title = "Permission Request - NHMP";
    if(req.user.username == "manager"){
        res.redirect("/manager");
    }
    Issue.findById(req.params.id, function(err, itemApproved){
        if(err){
            // console.log(err)
            req.flash("error", "An Error Occured.");
        }else{
            var name = itemApproved.name;
            var quantity = parseInt(itemApproved.quantity);
            var branchName = itemApproved.branchName;
            var receiverName = itemApproved.receiverName;
            var date = new Date(itemApproved.date);
            var time = itemApproved.time;
            var storeKeeperSign = itemApproved.storKeeperSign;
            var receiverSign = itemApproved.receiverSign;
            // console.log(itemApproved)
            Item.findOne({name: name}, function (err, itemFound) {
        if(err){
            // console.log("Error")
            req.flash("error", "An Error Occured.");
        }else if (quantity > itemFound.quantity){
            req.flash("error", "Item cannot be issued as there is less stock in Inventory, than you are trying to issue.");
            res.redirect("/supervisor")
        }else{
            // console.log(itemFound)
            RC.create({
                itemID: itemFound._id,
                name: name,
                quantity: quantity,
                branchName: branchName,
                receiverName: receiverName,
                date: date,
                time: time,
                storKeeperSign: storeKeeperSign
            }, function(err, rc){
                if(err){
                    // console.log("Error")
                    req.flash("error", "An Error Occured.");
                }else{
                    // console.log(rc)
                    var remain = itemFound.quantity - rc.quantity
                    InventoryRegister.create({
                        rcnumber: rc.id,
                        quantityRemaining: remain,
                        receiverName: receiverName,
                        receiverSign: receiverSign
                    }, function(err, IR){
                        if(err){
                            // console.log(err)
                            req.flash("error", "An Error Occured.");
                        }else{
                            // console.log(IR);
                            itemFound.quantity = IR.quantityRemaining
                            var newvalues = { $set: itemFound };
                            
                            Item.findOneAndUpdate({name: name}, newvalues, function(err, itemUpdated){
                                if(err){
                                    // console.log(err)
                                    req.flash("error", "An Error Occured.");
                                }else{
                                    // console.log(itemUpdated)
                                    Issue.findByIdAndRemove(req.params.id, function (err) {
                                        if(err){
                                            // console.log(err);
                                            req.flash("error", "An Error Occured.");
                                        }else{
                                            req.flash("success", "Request Approved and Permission granted to successfully issue item.");
                                            res.redirect("/supervisor")
                                        }
                                    });
                                }
                            })
                        }
                    })
                }
            })
        }
    })
        }
    })
})

app.delete("/rejectRequest/:id", isLoggedIn, function(req, res){
    res.locals.title = "Permission Request - NHMP";
    if(req.user.username == "manager"){
        res.redirect("/manager");
    }
    Issue.findByIdAndRemove(req.params.id, function (err) {
        if(err){
            // console.log(err);
            req.flash("error", "An Error Occured.");
        }else{
            req.flash("success", "Request Rejected to Issue Item successfully.");
            res.redirect("/supervisor")
        }
    });   
})

app.get("/inventoryregister", isLoggedIn, function(req, res){
    res.locals.title = "Inventory Register - NHMP";
    if(req.user.username == "supervisor"){
        res.redirect("/supervisor");
    }
    InventoryRegister.find({}, function(err, inventoryItems){
        if(err){
            console.log(err)
        }else{
            res.render("inventoryregister", {inventoryItems: inventoryItems})
        }
    })
})

app.get("/rcbook", isLoggedIn, function(req, res){
    res.locals.title = "RC Book - NHMP";
    if(req.user.username == "supervisor"){
        res.redirect("/supervisor");
    }
    RC.find({}, function(err, rcItems){
        if(err){
            console.log(err)
        }else{
            res.render("rcbook", {rcItems: rcItems})
        }
    })    
})

app.post("/login", passport.authenticate('local',
    {
        successRedirect: "/items",
        failureRedirect: "/login"
    }
), function(req, res){
    res.locals.title = "Login - NHMP";
    req.flash("error", "ERROR");
})

app.get("/logout", function(req, res){
    res.locals.title = "Log Out - NHMP";
    req.logout();
    req.flash("success", "Logged out successfully.");
    res.redirect("/login")
})

app.get('*', function(req, res){
    res.send('Does not Exist');
});

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be Logged In to perform that operation")
    res.redirect("/login");
}

app.listen(process.env.PORT || 3000, function () {
    console.log("Server Running on Port 3000");
});