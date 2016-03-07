var Game = {
  //Initialize game environnement
  ennemi: {},
  ennemiLife: 0,
  money: 10,
  dpsClick: 1,
  nbEnnemi: 0,
  nbHeroes: 0,
  init: function(heroes, ennemies) {
    for(var i = 0; i< heroes.length ; i++){
      this.createHero(heroes[i]);
      this.nbHeroes++;
    };

  for(var i=0; i< ennemies.length; i++){
    this.createEnnemi(ennemies[i]);
  }
  this.setEnnemi();
  this.affichage();
  this.setClick('fight');
  this.calcul();
  this.buy();
  },

  //Affiche la money et le dps / Click
  affichage: function(){
    $('.globalMoney').html('');
    $('.globalMoney').append('<li> Money : '+ this.money +' $</li>');
    $('.globalMoney').append('<li> Damages per clicks : '+ this.dpsClick +'</li>');
  },

  //Ajoute l'evenement click sur la vue et attack
  setClick: function(view){
    me = this;
    $('.'+view).click(function(){
      me.ennemi.life -= me.dpsClick;
      $('progress').val(me.ennemi.life);
      if(me.ennemi.life <= 0){
        me.money += me.ennemi.money;
        me.nbEnnemi ++;
        me.ennemi.life = config.lifeEnnemi;
        me.calcul();
        me.affichage();
        me.setEnnemi();
        me.save();
      }
    });
  },

  //Fonction pour l'achat - Level Up
  buy: function() {
    me = this;
    for(var i =0 ; i < $('button').length; i++) {
      $($('button')[i]).click(function() {
        for(var j = 0; j<personnage.length ; j++) {
          if(personnage[j].name == this.id) {
            var hero = personnage[j];
          }
        }
        if(me.canIBuy(hero)){
          me.money = Math.floor(me.money - hero.priceNext);
          hero.lvl++;
          hero.price = hero.priceNext;
          hero.priceNext = Math.floor(hero.price * Math.pow(config.algo, hero.lvl));
          hero.dps += 0.5;
          $('.heroList').html('');
          for(var j = 0; j < personnage.length; j++){
            if (personnage[j].type == 'hero') {
              me.createList(personnage[j]);
              if(personnage[j].lvl >= 1){
                $('.heroImg').children('li').children('img').each(function(index, element){
                    if(element.id == personnage[j].name){
                        $(element).css('display', 'block');
                    }
                })
              }
            }
          }
          me.calcul();
          me.affichage();
          me.buy();
        }
      })
    }
  },

  //Si le joueur peut acheter son perso ou lvl
  canIBuy: function(hero) {
    if(this.money >= hero.priceNext) {
      return true;
    }
    return false;
  },
  //Creer un perso de type Hero
  createHero: function(hero){
    this.createPerso(hero, 'hero');
  },
  //Creer un perso de type Ennemi
  createEnnemi: function(ennemi){
    this.createPerso(ennemi,'ennemi');
  },

  //Creer un perso
  createPerso: function(perso, type){
    var element = {};
    //Si Ennemi
    if(type == 'ennemi') {
      element.type = 'ennemi';
      element.life = config.lifeEnnemi;
      element.money = Math.ceil(Math.random()*10);
      //Sinon (Hero)
    } else {
      element.type = 'hero'
      element.price = Math.floor(10*((1+this.nbHeroes)*0.2));
      element.dps = 1;
      element.lvl = 0;
      element.priceNext = element.price * Math.pow(config.algo, element.lvl);
    }

    element.name = perso;
    element.img = perso + '.png';

    personnage.push(element);
    if(element.type == 'hero'){
      this.createList(element);
      this.createImg(element);
    }
  },

//Defini un ennemi
setEnnemi: function(){
  var ennemies = [];
  for(var i = 0; i < personnage.length; i++) {
    if(personnage[i].type == 'ennemi') {
      ennemies.push(personnage[i]);
    }
  }
  var ennemi = ennemies[Math.floor(Math.random()*ennemies.length)];
  ennemi.life = Math.floor(config.lifeEnnemi * Math.pow(config.algo, this.nbEnnemi));
  this.ennemiLife = ennemi.life;
  this.ennemi = ennemi;
  $('.showEnnemi').html('');
  $('.showEnnemi').append(
    '<img src="assets/img/'+ennemi.img+'">'
  );
  $('.life').html('');
  $('.life').append(
    '<progress value="'+this.ennemiLife+'" max="'+this.ennemiLife+'"></progress>'
  )
},
//Creer la liste des perso -- Un perso par perso
  createList: function(hero){
    $('.heroList').append(
        '<li>'+
        '<p>'+hero.name+'</p>'+
        '<p>Dps : '+hero.dps+'</p>'+
        '<p>Level : '+hero.lvl+'</p>'+
        '<button id="'+hero.name+'">Level up for '+hero.priceNext+' $</button>'+
        '</li>');
  },

// Crer les images associé aux heroes
  createImg: function(hero){
    $('.heroImg').append(
      '<li><img id="'+hero.name+'"src="assets/img/'+hero.img+'"></li>'
    );
  },

  //Calcul les dps global
  calcul: function(){
    this.dpsClick = 1;
    for(var i = 0; i < personnage.length; i++){
      if(personnage[i].type == 'hero'){
        this.dpsClick += personnage[i].dps;
      }
    }
  },

  //Sauvegarde des scores
  save: function(){
    if(localStorage.getItem('data') != null){
      var highscore = localStorage.getItem('data');
      highscore = JSON.parse(highscore);

      if(highscore.money < this.money) {
        highscore.money = this.money;
      }

      if(highscore.dps < this.dpsClick) {
        highscore.dps = this.dpsClick;
      }

      if(highscore.nbEnnemi = this.nbEnnemi) {
        highscore.nbEnnemi = this.nbEnnemi;
      }

      highscore = JSON.stringify(highscore);
      localStorage.setItem('data', highscore);
    } else {
      score.money = this.money;
      score.dps = this.dpsClick;
      score.nbEnnemi = this.nbEnnemi;

      var data = JSON.stringify(score);
      localStorage.setItem('data', data);
    }
  }
}
