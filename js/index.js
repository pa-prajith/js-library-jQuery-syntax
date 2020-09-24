$_(() => {
    console.log('This is from Dom Content loaded');

    $_('h1').css('color', 'red');
    $_('h2').css({'color': 'green', 'text-decoration': 'underline'});


    console.log($_('h1').html());
    console.log($_('h2').text());    

    $_('#btnAlert').on('click', () => alert('Hai From Button'));

    $_('ul>li').each(function (itx){
        if(itx%2 === 0) {
            $_(this).css('color', 'red');
        }
    })
});