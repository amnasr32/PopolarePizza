$(document).ready (function () {
    const btn = document.getElementById('evian');
    btn.addEventListener('click', function onClick(event) {
        // 👇️ Change text color globally
        //console.log("click")
        document.write( "Ajouté" );
        //var drink = get_drink("Evian","1.5L")
        //InsertElem = async (1,drink.nom,drink,1,drink.prix)
        console.log("yes");
      
        // 👇️ Change text color for clicked element only
        // event.target.style.color = 'salmon';
      });
    });