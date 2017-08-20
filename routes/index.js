const express = require("express"),
	 	router = express.Router(),
	 	mysql = require("mysql"),
	 	conn = mysql.createConnection({
			host     : 'localhost',
			user     : 'root',
			password : '',
			database : 'usuarios'
	 	});

router.get("/", (req, res) => {
	conn.query("SELECT * FROM usuarios", (err, usuarios) => {
		if (err) throw err;
		res.render("home", {title: "Lista de usuarios", usuarios: usuarios});
	})
});

router.get("/add-user", (req, res) => {
	res.render("addUser", {title: "Agregar usuarios"})
});

router.post("/", (req, res) => {

	let datosUsuario = {
		nombre: req.body.nombre,
		apellido: req.body.apellido,
	};

	if(req.files.foto) {
		let img = req.files.foto;
		img.mv(`public/uploads/${img.name}`, (err) => {
				if(err) {
					console.log("Error al insertar la imagen")
				} else {
					console.log("Imagen subida!")
				}
		});
		datosUsuario.foto = img.name;
	} else {
		datosUsuario.foto = "default.png";
	}

	conn.query("INSERT INTO usuarios SET ?", datosUsuario, (err, result) => {
		if(err) console.log("Error al insertar");
		if(result.affectedRows > 0) {
			res.redirect("/")
		}
	})

});

router.get("/user/:id", (req, res) => {
	let id = req.params.id;
	conn.query("SELECT * FROM usuarios WHERE id = ?", id, (err, usuario) => {
		if (err) console.log("No se pudo seleccionar datos");
		else {
			console.log(usuario);
			res.render("user", {
				id: usuario[0].id,
				nombre: usuario[0].nombre,
				apellido: usuario[0].apellido,
				foto: usuario[0].foto
			});
		}
	})
});

router.get("/user/:id/editar", (req, res) => {
	let id = req.params.id;

	conn.query("SELECT * FROM usuarios WHERE id = ?", id, (err, usuario) => {
		if (err) throw err;
		res.render("editarPerfil", {
			id: usuario[0].id,
			nombre: usuario[0].nombre,
			apellido: usuario[0].apellido,
			foto: usuario[0].foto
		});
	})
});

router.post("/user/:id/editar", (req, res) => {

	let datosUsuario = {
		id: req.params.id,
		nombre: req.body.nombre,
		apellido: req.body.apellido,
	};

	if(req.files.newfoto) {
		let img = req.files.newfoto;
		img.mv(`public/uploads/${img.name}`, (err) => {
			if(err) {
				console.log("Error al insertar la imagen")
			} else {
				console.log("Imagen subida!")
			}
		});
		datosUsuario.foto = img.name;
	}

	conn.query("UPDATE usuarios SET ? WHERE id = ? ", [datosUsuario, datosUsuario.id], (err, result) => {
		if(err) throw err;
		result.affectedRows > 0 ? res.redirect(`/user/${datosUsuario.id}`) : console.log(result)
	})

});


router.post("/user/borrar", (req, res) => {
	conn.query("DELETE FROM usuarios WHERE id = ?", req.body.id, (err, result) => {
		if(result.affectedRows > 0) {
			res.send("borrado")
		} else {
			res.send("error");
		}
	})
});


module.exports = router;