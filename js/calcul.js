function ready() {
  // Correction du style en fonction du navigateur
  if (-1 != navigator.userAgent.indexOf("Safari") && -1 == navigator.userAgent.indexOf("Chrome")) {
    document.getElementById("baseHebdo").style["-webkit-appearance"] = "none",
    document.getElementById("baseHebdo").style.paddingRight = "3px",
    document.getElementById("baseHebdo").style.paddingLeft = "2px",
    document.getElementById("marjorationHeuresSupp").style["-webkit-appearance"] = "none",
    document.getElementById("marjorationHeuresSupp").style.paddingRight = "3px",
    document.getElementById("marjorationHeuresSupp").style.paddingLeft = "2px"
  };

  // Activation des popups pour comprendre le salaire
  $(".popoverData").popover();
  $(".popoverOption").popover({
    trigger: "hover"
  })
}

function smic() {
  // Modification de la valeur du taux horaire et calcul du salaire
  document.getElementById("tauxHoraire").value = 9.76;
  convertFunction();
}

function convertFunction() {
  // Réception des inputs utilisateur
  tauxHoraire = document.getElementById("tauxHoraire").value;
  baseHebdo = document.getElementById("baseHebdo").value;
  nombreHeuresHebdo = document.getElementById("nombreHeuresHebdo").value;
  marjorationHeuresSupp = document.getElementById("marjorationHeuresSupp").value;
  isTickets = document.getElementById("isTickets");
  tickets = document.getElementById("tickets").value;
  isTreiziemeMois = document.getElementById("isTreiziemeMois");
  arePrimes = document.getElementById("arePrimes");

  // Réception des inputs liés aux primes
  for (var e = 1; 3 >= e; e++) {
    isMonthly[e] = document.getElementById("isMonthly" + e);
    isDayly[e] = document.getElementById("isDayly" + e);
    prime[e] = document.getElementById("prime" + e).value;
  };

  // Remplacement du séparateur virgule par un point
  tauxHoraire = tauxHoraire.replace(",", ".");
  nombreHeuresHebdo = nombreHeuresHebdo.replace(",", ".");
  tickets = tickets.replace(",", ".");

  // Remplacement du séparateur virgule par un point pour les primes
  for (var e = 1; 3 >= e; e++) {
    prime[e] = prime[e].replace(",", ".");
  }

  // Remplacement des valeurs nulles par zéro
  if (1 == isNaN(tauxHoraire)) {
    tauxHoraire = 0
  }
  if (1 == isNaN(nombreHeuresHebdo)) {
    nombreHeuresHebdo = 0
  }
  if (1 == isNaN(tickets)) {
    tickets = 0
  }

  // Remplacement des valeurs nulles par zéro pour les primes
  for (var e = 1; 3 >= e; e++) {
    if (1 == isNaN(prime[e])) {
      prime[e] = 0
    }
  }

  // Gestion de l'affichage des inputs de majoration des heures supplémentaires
  // si l'utilisateur saisie plus de 35 heures hebdo
  if (nombreHeuresHebdo > 35) {
    $("#collapseHeuresSupp").collapse("show")
  } else {
    $("#collapseHeuresSupp").collapse("hide")
  }

  // Calcul du revenu de base (heures supplémentaires inclues sans majoration)
  var revenuBase = Math.round(
    tauxHoraire *
    constNombreHeureMois *
    (1 - constTauxCharges) *
    (nombreHeuresHebdo / 35)
  )

  // Calcul du revenu lié à la majoration des heures supplémentaires
  var revenuMajoration = Math.round(
    (nombreHeuresHebdo - baseHebdo) *
    nbSemainesMois *
    tauxHoraire *
    (1 - constTauxCharges) *
    (marjorationHeuresSupp / 100)
  );

  // Si le nombre d'heures par semaine est plus grand que le seuil de déclanchement
  // des heures supplémentaires alors on applique la majoration. Dans le cas contraire,
  // il n'y a pas de majoration
  if (nombreHeuresHebdo > baseHebdo) {
    salaireBase = revenuBase + revenuMajoration;
    salaireBaseAvecPrime = revenuBase + revenuMajoration
  } else {
    salaireBase = revenuBase;
    salaireBaseAvecPrime = revenuBase
  }

  // Gestion de l'affichage de montant des tickets restaurant. S'il y a des tickets
  // restaurant alors on retire la part du salarié
  if (isTickets.checked) {
    $("#collapseTickets").collapse("show");
    salaireBaseAvecPrime -= Math.round(tickets * constNombreHeureMois / 7 * .5)
  }
  // S'il n'y a pas de ticket restaurant, on réinitialise le montant
  else {
    $("#collapseTickets").collapse("hide");
    document.getElementById("tickets").value = "0"
  }

  // Gestion de l'affichage des primes. S'il y a des primes, on ajoute le montant
  // Attention, les primes n'influent pas sur les IFM et CP !
  if (arePrimes.checked) {
      $("#collapsePrimes").collapse("show");
      // Vérification du type de primes (mensuelle ou journaliaire)
      for (var e = 1; 3 >= e; e++) {
        if (isMonthly[e].checked) {
          salaireBaseAvecPrime += Math.round(prime[e] * nbJoursMois * (1 - constTauxCharges))
        } else {
          salaireBaseAvecPrime += Math.round(prime[e] * (1 - constTauxCharges))
        }
      }
  }
  // S'il n'y a pas de prime, on réinitialise le montant et le type
  else {
      $("#collapsePrimes").collapse("hide");
      for (var e = 1; 3 >= e; e++) {
        document.getElementById("prime" + e).value = "0";
        isMonthly[e].checked = 0;
        isDayly[e].checked = 0;
      }
  }

  // Affichage du 13e mois
  if (isTreiziemeMois.checked) {
    treiziemeMois = Math.round(revenuBase / 12);
    document.getElementById("treiziemeMois").innerHTML = treiziemeMois
  } else {
    treiziemeMois = 0
    document.getElementById("treiziemeMois").innerHTML = treiziemeMois
  }

  // Affichage du salaire de base
  document.getElementById("salaireBase").innerHTML = salaireBaseAvecPrime;

  // Affichage des IFM (les primes n'ont pas d'influence sur ce montant)
  var ifm = Math.round((salaireBase + treiziemeMois) / 10);
  document.getElementById("IFM").innerHTML = ifm;

  // Affichage des CP (les primes n'ont pas d'influence sur ce montant)
  var cp = Math.round((salaireBase + treiziemeMois + ifm) / 10);
  document.getElementById("CP").innerHTML = cp;

  var salaireNetTotal = salaireBaseAvecPrime + treiziemeMois + ifm + cp;
  document.getElementById("salaireNetTotal").innerHTML = salaireNetTotal
}

// Valeurs par défaut
var tauxHoraire = 0,
  baseHebdo = 0,
  nombreHeuresHebdo = 0,
  marjorationHeuresSupp = 0,
  salaireBase = 0,
  salaireBaseAvecPrime = 0,
  isTreiziemeMois = 0,
  treiziemeMois = 0,
  isTickets = 0,
  tickets = 0,
  arePrimes = 0,

  prime = new Array,
  isMonthly = new Array,
  isDayly = new Array;

// Constantes
var constNombreHeureMois = 151.67,
  nbSemainesMois = constNombreHeureMois / 35,
  nbJoursMois = constNombreHeureMois / 7,
  constTauxCharges = .23;
