## Erreurs :
- ``err : already processed`` : Ce message a déjà conduit à une promotion et ne sera pas traité à nouveau. Cela évite les doubles promotions pour une même réaction.
- ``err : X (lors de la récupération du message)`` : Une erreur technique est survenue lors de la tentative de récupération du message. X sera remplacé par le message d'erreur spécifique.
- ``err : validator role not found`` : Le rôle spécifié pour valider les promotions n'a pas été trouvé dans le serveur. Vérifiez l'existence et le nom du rôle de validateur.
- ``err : current role (X) not found`` : Le rang actuel de l'utilisateur n'a pas été trouvé dans la liste des rôles disponibles pour la promotion. X indiquera le rôle actuel non trouvé.
- ``err : channel mismatch`` : La réaction a été ajoutée dans un salon qui ne correspond pas au niveau de progression attendu pour l'utilisateur, empêchant ainsi la promotion.
- ``err : new role not found`` : Le nouveau rôle destiné à la promotion de l'utilisateur n'a pas été trouvé. Vérifiez la liste des rôles et l'index du nouveau rôle.
- ``err : not a validator`` : L'utilisateur qui a réagi n'a pas le rôle de validateur requis pour effectuer la promotion. Seuls les validateurs peuvent déclencher des promotions.
- ``err : unknown reaction`` : La réaction ajoutée au message n'est pas celle attendue pour déclencher une promotion. Vérifiez le nom de la réaction configurée.
## Succès :
- ``(validator)`` : L'utilisateur a le rôle de validateur et est autorisé à effectuer des promotions. Ce message confirme que le processus de vérification des droits de l'utilisateur a réussi.
- ``(promotion de X au rang Y)`` : L'utilisateur a été promu au nouveau rang avec succès. X sera remplacé par le tag de l'utilisateur promu, et Y par le nom du nouveau rôle attribué.