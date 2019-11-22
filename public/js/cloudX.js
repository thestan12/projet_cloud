var numImage = 0;
var interval;
var datev = false;
var mdp1v=false;
var mdp2v=false;
var mdpv = false;
var nomv = false;
var prenomv = false;
var mailv = false;
var prenomv1 = true;


function verifMail() {
    var mail =$("#email").val();
    if (mail.length < 5) {
        mailv = false;
      $("#email").css({"border": "solid", "border-width": "0.1px"});
      $("#email").css("border-color", "red");
      Swal.fire({
            type: 'error',
            title: 'Oops...',
            text: 'Adresse mail non valide !',
        })
    } else {
        mailv = true;
        $("#email").css({"border": "solid", "border-width": "0.1px"});
        $("#email").css("border-color", "#C2C2C2");
    }
}

function verifprenom() {
    var prenom = $("#prenom").val();
    if(prenom.length == 0){
    $("#prenom").css({"border": "solid", "border-width": "0.1px"});
    $("#prenom").css("border-color", "red");
        prenomv=false;
        prenomv1=false;
        return;
    }
    if (prenom.length <= 2) {
        prenomv = false;
        prenomv1=false;
        Swal.fire({
            type: 'error',
            title: 'Oops...',
            text: 'le prenom est trop court !',
        })
        $("#prenom").css({"border": "solid", "border-width": "0.1px"});
        $("#prenom").css("border-color", "red");

        return;
    }
    var res = 0;
    for (var i = 0; i < prenom.length; i++)
        if ((prenom.charAt(i) >= 'a' && prenom.charAt(i) <= 'z') || (prenom.charAt(i) >= 'A' && prenom.charAt(i) <= 'Z'))
            res++;

    if (res != prenom.length) {
        Swal.fire({
            type: 'error',
            title: 'Oops...',
            text: 'le prenom doit etre constitué seulement des lettre alphabetique !',
        })
        $("#prenom").css({"border": "solid", "border-width": "0.1px"});
        $("#prenom").css("border-color", "red");
        prenomv = false;
        prenomv1=false;

    }
    else {
        $("#prenom").css({"border": "solid", "border-width": "0.1px"});
        $("#prenom").css("border-color", "#C2C2C2");
        prenomv = true;
        prenomv1=true;
    }


    return;
}
function verifmdp() {
   var mdp1 = $("#mdp").val();
   if(mdp1.length==0){
        $("#mdp").css({"border": "solid", "border-width": "0.1px"});
        $("#mdp").css("border-color", "red");
        mdp1v=false;
        return;
   }

   if (mdp1.length < 7) {

        $("#mdp").css({"border": "solid", "border-width": "0.1px"});
        $("#mdp").css("border-color", "red");
        mdp1v = false;
        Swal.fire({
            type: 'error',
            title: 'Oops...',
            text: 'le mot de passe doit contenir au moins 7 caractères !',
        })
     return ;
    }

        $("#mdp").css({"border": "solid", "border-width": "1px"});
        $("#mdp").css("border-color", "#C2C2C2");
        mdp1v = true;
        return ;


}
function verifmdpMatch() {
    if(!mdp1v){
        Swal.fire({
            type: 'error',
            title: 'Oops...',
            text: 'le mot de passe doit contenir au moins 7 caractères !',
        })
        mdpv=false;
        return;
    }

    var mdp1 = $("#mdp").val();
    var mdp2 = $("#mdpc").val();

    if (mdp1 != mdp2) {
        $("#mdpc").css({"border": "solid", "border-width": "0.1px"});
        $("#mdpc").css("border-color", "red");
        mdpv = false;
        Swal.fire({
            type: 'error',
            title: 'Oops...',
            text: 'les mots de passe saisis ne sont pas identiques !',
        })
        return;
    }



        $("#mdpc").css({"border": "solid", "border-width": "1px"});
        $("#mdpc").css("border-color", "#C2C2C2");
        mdpv = true;

    return;
}
function validateForm() {
    lert(mdp+" "+nom+" "+prenom);
    if (mdpv && prenomv && mailv) {
        return true;
    }
    else {

        Swal.fire({
            type: 'error',
            title: 'Oops...',
            text: 'veuillez vérifier votre saisie'
        });
        return false;

    }
}


