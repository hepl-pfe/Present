# Present
## Un gestionaire de présences
Depuis la loi du 29 juin 1983, les institutions primaires et secondaires sont légalement tenues de prévenir le tuteur, de l'enfant mineur lorsque celui-ci ne se présente pas au cours. Présent est un outil qui permet de prendre les présences depuis une interface web agréable et intuitive afin de répondre à cette obligation.

## Utilités
- Prendre facilement les présences afin d'avertir les parents de l'absence de leur enfant.
- Se faire une représentation des élèves, absents et présents.
- Voir les locaux disponibles lors d'une heure de cours

### Les fonctions
- [ ] Créer, accéder, modifier et supprimer, un horaire.
- [ ] Créer, accéder, modifier et supprimer, un professeur.
- [ ] Créer, accéder, modifier et supprimer, un éducateur.
- [ ] Créer, accéder, modifier et supprimer, un élève.
- [ ] Créer, accéder, modifier et supprimer, des groupes d'élèves.
- [ ] Accéder à une représentation virtuelle, de tous les élèves absents, présents, en cours de validation.
- [ ] Associer un élève à un cours.
- [ ] Associer un cours à un professeur.
- [ ] Associer un cours donné par un professeur à une plage horaire.
- [ ] Changer le statut des étudiants. Par défaut, tous les étudiants sont « en cours de validation ».
- [ ] Envoyer un mail à tous les parents afin de les prévenir de l'absence de leur enfant, si le parent n'a pas prévenu une personne de l'école.
- [ ] Créer des groupes d'élèves et de les associer à une plage horaire.
- [ ] Accéder à liste de tous les locaux et de voir les locaux disponibles

### Utilisateurs
- Administrateur, est l'utilisateur principal qui inscrit l'école. C'est lui qui doit compléter les informations relatives à l'école. Il a également tous les droits et peut créer, afficher, modifier et supprimer tous les autres types d'utilisateurs. Il est prévu qu'il inscrive tous les élèves afin que les éducateurs et professeurs puissent travailler avec. Il a pour but de gérer la représentation virtuelle de l'école. L'administrateur a également accès à toutes les notes concernant un élève.
- Les éducateurs : sont les utilisateurs qui ont pour mission d'envoyer un mail aux parents dont les enfants ne sont pas présents aux cours. Ils ont tous les droits sur la création, modification et suppression des élèves, mais pas des professeurs. Ils peuvent également afficher toutes les notes relatives à un étudiant.
- Les professeurs sont les utilisateurs qui ont pour mission de prendre les présents en classe afin que les éducateurs puissent consulter la liste de tous les étudiants absents. Ils peuvent également ajouter des notes relatives à un cours ou une année.
- Les élèves ne sont pas utilisateurs de l'application, mais ils sont représentés.

### Technologies
- Laravel
- Jade,SASS,Inuit
- HTML5,CSS3
- Vue.js
- Role aria

### À faire
- [ x ] Intégration des maquettes
- [ ] Intégration du framework [Vue.js](http://vuejs.org/).
- [ ] Créer un sous dommaine afin de gérer avec Laravel une API rest
- [ ] Ajouter des statistiques
