
(function ($) {
    "use strict";
    $.fn.gameTaquin = function (image,parametres) {
        //initialisation des variables
        
        

        var clickFunction,debutJeu,etatJeu,plateauLargeur = 0,plateauHauteur = 0 ,width= 0,
            height=0,deplacement =$("#myinput").val();
            
            
       
       
        //Fonctions prédefenies qui vont etre utilisées plus tard. 
        
         function gagnant(){
            alert("Gagnant avec" + " " +deplacement+" "+"deplacements");
        }

        
        //Reperer la case dans le jeu.(les coordonnes de la tuile)
        function getId(taquin) {
            var classList = taquin.attr("class").split(/\s+/),
                result = "";
            $.each(classList, function (index, item) {
                if (index === 0) {
                    result = item;
                }
            });
            return result;
        }

        function getCoord(id) {
            var coord = [];
            for (var i = 0; i < debutJeu.length; i++) {
                for (var j = 0; j < debutJeu[0].length; j++) {
                    if (etatJeu[i][j][1] == id) {
                        coord[0] = i;
                        coord[1] = j;
                    }
                }
            }
            return coord;
        }

        // l'element qui va etre caché
        function getvide() {
            var vide = [];
            for (var i = 0; i < debutJeu.length; i++) {
                for (var j = 0; j < debutJeu[0].length; j++) {
                    if (etatJeu[i][j][0] == false) {
                        vide[0] = i;
                        vide[1] = j;
                        vide[2] = etatJeu[i][j][1];
                    }
                }
            }
            return vide;
        }

       
       //Initialiser le jeu
        function init(rows,cols) {
            var game = [],Row,Div,objetCourant;
            for (var i = 0; i < rows; i++) {
                Row = [];
                for (var j = 0; j < cols; j++) {
                    Div = [];
                    objetCourant = true;
                    if ((i == 0) && (j == 0) && ("br" == "tl")) { objetCourant = false; }
                    if ((i == (rows - 1)) && (j == 0) && ("br" == "tr")) { objetCourant = false; }
                    if ((i == 0) && (j == (cols - 1)) && ("br" == "bl")) { objetCourant = false; }
                    if ((i == (rows - 1)) && (j == (cols - 1)) && ("br" == "br")) { objetCourant = false; }
                    Div[0] = objetCourant;
                    Div[1] = "taquin-" + i + "-" + j;
                    Row[j] = Div;
                }
                game[i] = Row;
            }
            return game;
        }
        
        
        // brasser les tuiles.
        //code pris de ce lien
        //http://blog.haeresis.fr/jeu-du-taquin-en-jquery-pour-vos-sites/
        function shuffle() {
            var vide,voisin,temp,i = 0,rand = 0;
            for (var t = 0; t < 150; t++) {
                vide = getvide();
                voisin = [];
                i = 0;
                // On cherche les voisins deplcables.
                try { 
                    if (etatJeu[vide[0]][vide[1] - 1][0] == true) {
                    voisin[i] = [];
                    voisin[i][0] = vide[0];
                    voisin[i][1] = vide[1] - 1;
                    i += 1;
                } } catch (err1) {}
                try { if (etatJeu[vide[0] + 1][vide[1]][0] == true) {
                    voisin[i] = [];
                    voisin[i][0] = vide[0] + 1;
                    voisin[i][1] = vide[1];
                    i += 1;
                } } catch (err2) {}
                try { if (etatJeu[vide[0]][vide[1] + 1][0] == true) {
                    voisin[i] = [];
                    voisin[i][0] = vide[0];
                    voisin[i][1] = vide[1] + 1;
                    i += 1;
                } } catch (err3) {}
                try { if (etatJeu[vide[0] - 1][vide[1]][0] == true) {
                    voisin[i] = [];
                    voisin[i][0] = vide[0] - 1;
                    voisin[i][1] = vide[1];
                    i += 1;
                } } catch (err4) {}

                // On choisit au hasard le voisin à brasser.
                rand = Math.floor(Math.random() * voisin.length);
                temp = etatJeu[vide[0]][vide[1]];
                //interchanger les tuiles
                etatJeu[vide[0]][vide[1]] = etatJeu[voisin[rand][0]][voisin[rand][1]];
                etatJeu[voisin[rand][0]][voisin[rand][1]] = temp;
            }

            for (var i = 0; i < debutJeu.length; i++) {
                for (var j = 0; j < debutJeu[0].length; j++) {
                    // determiner la nouvelle position du carreau
                    for (var k = 0; k < etatJeu.length; k++) {
                        for (var l = 0; l < etatJeu[0].length; l++) {
                            if (debutJeu[i][j][1] ==etatJeu[k][l][1]) {
                                if (debutJeu[i][j][0] == true) {
                                    $(".taquin-" + i + "-" + j).animate({
                                        top: "+=" + parseInt((plateauHauteur * l) - $(".taquin-" + i + "-" + j).position().top, 10) + "px",
                                        left: "+=" + parseInt((plateauLargeur * k) - $(".taquin-" + i + "-" + j).position().left, 10) + "px"
                                    });
                                } else {
                                    $(".taquin-" + i + "-" + j).css({
                                        "top": (plateauHauteur * l),
                                        "left": (plateauLargeur * k)
                                    });
                                    break;
                                }
                            }
                        }
                    }
                }
            }
        }

        // gestion de l'evenment clique de la souris.
        clickFunction = function (taquinP, source) { 
                var vide,moveTop = 0,moveLeft = 0,tempTop = 0,tempLeft = 0,temp,id = getId(source),
                coord = getCoord(id),vide = getvide();
                deplacement++;
                $("#myinput").text(deplacement);
                // On trouve les déplacements pour l'animation.
                taquinP.find("." + vide[2]).show();
                moveTop = taquinP.find("." + id).position().top - taquinP.find("." + vide[2]).position().top;
                moveLeft = taquinP.find("." + id).position().left - taquinP.find("." + vide[2]).position().left;
                taquinP.find("." + vide[2]).hide();
                //On garde les variables.
                tempTop = source.position().top;
                tempLeft = source.position().left;
                // gestion de l'element vide.
                temp = etatJeu[coord[0]][coord[1]];
                etatJeu[coord[0]][coord[1]] = etatJeu[vide[0]][vide[1]];
                etatJeu[vide[0]][vide[1]] = temp;
                 
                // On anime le changement.(clics claviers)
                
                $(document).keydown(function(e){
                        
                     if (e.which == 39){
                       source.off("keypress.39").stop().animate({
                          top: "-=" +  moveTop
                        });
                       }
                        if (e.which == 37)
                        {
                            source.off("keypress.37").stop().animate({
                          top: "+=" + moveLeft
                        });
                        }
                })

                // On anime le changement.(clics souris)
                source.off("click").animate({
                    top: "-=" + moveTop,
                    left: "-=" + moveLeft
                }, function () {
                    source.on("click", function () {
                        clickFunction(taquinP, source);
                    });
                    if (etatJeu.toString() === debutJeu.toString()) {
                        taquinP.find(".taquin-carreau").off("click");
                        var vide = getvide();
                        $("." + vide[2]).show().animate({ opacity: "1" }, function () {
                            gagnant();
                        });
                    }
                });
               
                taquinP.find("." + vide[2]).css({
                    "top": tempTop + "px",
                    "left": tempLeft + "px"
                });
           
        };
        // Demarrer le jeu
        function demarrer(taquinP) {	
            taquinP.find(".taquin-carreau").off("click");
            var vide = getvide();
            $("." + vide[2]).animate({ opacity:0.5 }, function () {
               
                $(this).hide();
                
                shuffle();
                taquinP.find(".taquin-carreau").on("click", function () {
                    clickFunction(taquinP, $(this));
                });   
            });
        }   

        // L'image devient un taquin.
        function taquin(taquinP, imageOriginalSize1,imageOriginalSize2) {
       
            var rows =$("#row").val(),cols =$("#col").val(),imageWidth = 0,imageHeight = 0;
            if (parseInt(width, 10) !== 0) { imageWidth = width; } else { imageWidth = imageOriginalSize1; }
            if (parseInt(height, 10) !== 0) { imageHeight = height; } else { imageHeight = imageOriginalSize2; }
            plateauLargeur = Math.round(imageWidth /rows);
            plateauHauteur = Math.round(imageHeight/cols);

            // Initialise l'etat initial et actuelle du jeu.
            debutJeu = init(rows,cols);
            etatJeu = init(rows,cols);
            taquinP.css({ 
               "width": imageWidth + "px",
               "height": imageHeight + "px"
            });

            // generer les petits carreaux
            for (var i = 0; i < debutJeu.length; i += 1) {
                for (var j = 0; j < debutJeu[0].length; j += 1) {
                    $("<div>", {
                        css: {
                            cursor: "move",
                            backgroundImage: "url('" + image + "')",
                            backgroundPosition : "-" + parseInt(plateauLargeur * i, 10) + "px -" + parseInt(plateauHauteur * j, 10) + "px",
                            position: "absolute",
                            top: parseInt(plateauHauteur * j, 10) + "px",
                            left: parseInt(plateauLargeur * i, 10) + "px",
                            width: plateauLargeur + "px",
                            height: plateauHauteur + "px"
                           
                        }
                    }).appendTo(taquinP).addClass(debutJeu[i][j][1]).addClass("taquin-carreau");
                }
            }
           
           //appliquer le mecanisme lorsque il appuie sur le bouton brasser
		    document.getElementById("brasser").onclick = function(){ 
			   demarrer(taquinP);
			   $('button[id="brasser"]').prop('disabled', true);   
			}
			   
         taquinP.find(".taquin-carreau").on("click", function () {         
                            demarrer(taquinP);
           });    
        }
        return this.each(function () {
            var imageT = new Image(),element = $(this);
                imageT.src = image;
                //genere le div qui contient le jeu complet.
                var taquinP = $("<div>").addClass("taquin-canvas");
                if (element.next().hasClass("taquin-canvas")) {
                    element.next().remove();
                }
                element.after(taquinP);
                taquin(taquinP,imageT.width,imageT.height);
        });
    };
}(jQuery));