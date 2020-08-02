function onlyNums(e) {
    const code = window.event ? e.which : e.ketCode;
    return !(code < 48 || code > 57);
}

var bill = [{
        "billNumber": "345345",
        "billDate": "2017-7-21",
        "paymentType": "Credito",
        "term": "30",
        "totalValue": 234454,
        "pays": []
    },
    {
        "billNumber": "872034",
        "billDate": "2020-6-25",
        "paymentType": "Contado",
        "term": "0",
        "totalValue": 7435246,
        "pays": []
    },
    {
        "billNumber": "293658",
        "billDate": "2018-12-4",
        "paymentType": "Credito",
        "term": "90",
        "totalValue": 932937,
        "pays": []
    }
]


class Pay {
    constructor(no, date, pay, balance, note) {
        this.date = date,
            this.pay = pay,
            this.balance = balance,
            this.note = note,
            this.no = no
    }
}

function output_table_pays(No_bill, No_Pays, total_pays, due_date, balance) {
    this.No_bill = No_bill,
        this.No_Pays = No_Pays,
        this.total_pays = total_pays,
        this.due_date = due_date,
        this.balance = balance
}
var datos = [];

var billShow = JSON.parse(JSON.stringify(bill))


$(() => { 
    $.each(billShow, function(i, _bill1) {
        if(_bill1.paymentType!="Contado"){ 
            
            var billNumber = _bill1.billNumber;
            var billDate = _bill1.billDate;
            var paymentType = _bill1.paymentType;
            var term = parseInt(_bill1.term);
            var totals = String(_bill1.totalValue);
            var rango = "0-"+term;

            var chain = totals.replace(/\D/g, "")
            const newValue = new Intl.NumberFormat('en-US').format(chain);
           
                datos.push({
                    'number' : billNumber,
                    'date' : billDate,
                    'pay' : paymentType,
                    'plazo' : rango,
                    'totall' : "$" + newValue
                })
        } 
                  
    });
})



$(() => {  
    // billShow es una copia del arreglo original, no lo alteramos directamente para no generar daños a los valores
    // asi que el formato se lo damos con el arreglo copia =>
   
    for (let i = 0; i < bill.length; i++) {
        var value =billShow[i].totalValue
        var chain = String(value).replace(/\D/g, "")
        const newValue = new Intl.NumberFormat('en-US').format(chain) 
        billShow[i].totalValue = newValue  
    }

    $('#table_1').DataTable({
        "data": billShow,
        "columns": [
            { "data": "billNumber" },
            { "data": "billDate" },
            { "data": "paymentType" },
            { "data": "term" },
            { "data": "totalValue" }
        ],

        "paging": false,
        "searching": false,
        "ordering": false,
        "info": false,
        "responsive": true
    });
    //Agregar los # de factura al select
    for (bills of bill) {
        $('#numeroFac').append(new Option(bills.billNumber))
    }
    //Agregar el valor del saldo según el # de factura
    $('#numeroFac').on('change', () => {
        const number = $('#numeroFac option:selected').val()
        $('#saldo').val(get_balance(number))
        const value = $('#saldo')
        var chain = String(value.val()).replace(/\D/g, "")
        const newValue = new Intl.NumberFormat('en-US').format(chain)
        value.val("$" + newValue)
        var validate= validateBill(number)

        if (validate!=null) {
            $('#obser').prop('disabled', true)            
            $('#abono').val("$" + newValue)
            $('#nuevoSaldo').val("$0")
            $('#obser').val("Pago de Contado")
            $('#abono').prop('disabled', true)
        }else{
            $('#abono').prop('disabled', false)
            $('#obser').prop('disabled', false) 
            $('#abono').val('')
            $('#nuevoSaldo').val('')
            $('#obser').val('')  
        }
    })
})

// dar formato al saldo 
$('#saldo').on('change', () => {
    const value = $('#saldo')
    var chain = String(value.val()).replace(/\D/g, "");
    chain = chain.val().replace(/([0-9])([0-9]{2})$/, '$1.$2');
    const newValue = new Intl.NumberFormat('en-US').format(chain);
    value.val(newValue);
})

//dar formato al campo de entrada del abono
$('#abono').on('keyup', () => {
    const number = $('#numeroFac option:selected').val()
    const value = $('#abono')
    var chain = String(value.val()).replace(/\D/g, "")
    var amount = parseInt(value.val().replace(/[^a-zA-Z0-9]/g, ''))
    const newValue = new Intl.NumberFormat('en-US').format(chain)
    value.val("$" + newValue);

    // restriccion de no poder abonar mas del saldo que hay
    var balance= parseInt($('#saldo').val().replace(/[^a-zA-Z0-9]/g, ''))    
    if (amount > balance) {
        $('#abono').val('')
        $('#nuevoSaldo').val('')
        Swal.fire({
            icon: 'error',
            title: 'Ha ingresado un valor sobre el saldo de la factura',
            showConfirmButton: false,
            timer: 1500                     
        })
        
    }else {
        //actualizamos el nuevo saldo y damos formato
        $('#nuevoSaldo').val(calculate_new_balance(number, amount))    
        const value2 = $('#nuevoSaldo')
        var chain2 = String(value2.val()).replace(/\D/g, "")
        const newValue2 = new Intl.NumberFormat('en-US').format(chain2)
        value2.val("$" + newValue2)
    }

    
})

// funcionalidad boton 'Realizar Abono'
$('#enviar').click(function() {
        var  billNumber= $('#numeroFac option:selected').val();
        var amount = $('#abono').val();
        var note = $('#obser').val();
        var newSa = $('#nuevoSaldo').val();

        if(billNumber!='872034'){
            // validamos que haya saldo en la cuenta
            if($('#saldo').val()==="$0"){
                Swal.fire({
                    icon: 'error',
                    title: 'No hay saldo a pagar en esta factura'                  
                })
            }
            // validamos campo de abono  si esta vacio
            else if (amount==="" || amount==="$0" || note==="") {
                Swal.fire({
                    icon: 'error',
                    title: 'No deje campos vacios'                  
                })
                
            }
            else{
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Operación Exitosa',
                    showConfirmButton: false,
                    timer: 1500
                })
                setTimeout(() => {            
                    newAmount = parseInt(amount.replace(/[^a-zA-Z0-9]/g, ''));
                    make_payment(billNumber, newAmount, note)          
                    print_pays()   
                    $.each(datos, function(i, _total) {
                        if(datos[i].number===billNumber){
                            datos[i].totall=newSa;      
                        }
                    });  
                    clean()                   
                }, 1000)      
            }
        }else{
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Su factura ya fue cencalada!',
                showConfirmButton: false,
                timer: 1500        
              })
            } 
})


$('#consulCar').click(function() {  
    addTable();      
});  

//Prueba de modificación en el Array OK
$('#cancel').click(function() {
    
    Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Operación Cancelada!',
        showConfirmButton: false,
        timer: 1500        
      })
      
      clean()
    var factura = $('#numeroFac option:selected').val();
    $.each(bill, function(i, val) {
        if (bill[i].billNumber === factura) {
            alert("Nuevo saldo :" + bill[i].totalValue);
        }
    });
})



//-------------------------------------------------------- Funciones ---------------------------------------------------
function addTable(){
    $('#tblBody').empty();
    $('#table_5').DataTable().destroy();
    var table = $('#table_5').DataTable({
        "data": datos,
        "columns": [
            { "data": "plazo" },
            { "data": "number" },
            { "data": "date" },
            { "data": "totall" }
        ],
        "paging": false,
        "searching": false,
        "ordering": false,
        "info": false,
        "responsive": true
    })
    
}

// imprimir tabla abonos
function print_pays() {    


    var print = []
    $.each(bill, function(i, _bill) {
        if(_bill.paymentType!='Contado'){
            var date = new Date(_bill.billDate);
            var days = parseInt(_bill.term);
            var balance = get_balance(_bill.billNumber)
            var total= get_total_pays(_bill.billNumber)
            

            var chain = String(balance).replace(/\D/g, "")
            const newBalance = new Intl.NumberFormat('en-US').format(chain) 

            var chain2 = String(total).replace(/\D/g, "")
            const newTotal = new Intl.NumberFormat('en-US').format(chain2)

            if(num_pays(_bill.billNumber)>0){
                print.push(new output_table_pays(_bill.billNumber, num_pays(_bill.billNumber), "$"+newTotal, fechaVen(date, days), "$"+newBalance))
            } 
        }
          
    })

    
    $('#tblBody').empty();
    $('#table_2').DataTable().destroy();
    table = $('#table_2').DataTable({
        "data": print,
        "columns": [
            { "data": "No_bill" },
            { "data": "No_Pays" },
            { "data": "total_pays" },
            { "data": "due_date" },
            { "data": "balance" },
            {
                "defaultContent": "<button type='button' class='selec btn btn-primary sm' data-toggle='modal' data-target='#buscar'><i class='fas fa-search'></i></button>",
                "className": "text-center"
            }
        ],
        "paging": false,
        "searching": false,
        "ordering": false,
        "info": false,
        "responsive": true
    })
    $("#table_2 tbody").on("click", "button.selec", function() {
        var data = table.row($(this).parents('tr')).data()        
        print_pays_table(data.No_bill)
    })
}



// imprimir tabla abono lupita
function print_pays_table(No_bill) {
    
    var pays = get_bill(No_bill).pays   

    var copyPays = JSON.parse(JSON.stringify(pays))
    
    // billShow es una copia del arreglo original, no lo alteramos directamente para no generar daños a los valores
    // asi que el formato se lo damos con el arreglo copia =>
    for (let i = 0; i < copyPays.length; i++) {
        var value =copyPays[i].balance
        var chain = String(value).replace(/\D/g, "")
        
        const newValue = new Intl.NumberFormat('en-US').format(chain) 
        copyPays[i].balance = newValue 
        
        var value2 = copyPays[i].pay
        var chain2 = String(value2).replace(/\D/g, "")        
        const newValue2 = new Intl.NumberFormat('en-US').format(chain2) 
        copyPays[i].pay = "$" +newValue2 
    }

    $('#tblBody').empty();
    $('#table_3').DataTable().destroy();
    var table = $('#table_3').DataTable({
        "data": copyPays,
        "columns": [
            { "data": "no" },
            { "data": "date" },
            { "data": "note" },
            { "data": "pay" },
            { "data": "balance" },
        ],
        "paging": false,
        "searching": false,
        "ordering": false,
        "info": false,
        "responsive": true
    })
}
// obtener factura
function get_bill(billNumber) {
    var output
    $.each(bill, function(i, _bill) {
        if (_bill.billNumber === billNumber) {
            //alert(JSON.stringify(bill[i]))
            output = i
        }
    })
    return bill[output]
}

// hacer el pago y agregarlo al arreglo de pago de la factura
function make_payment(billNumber, amount, note) {
    let balance
    var _bill = get_bill(billNumber)
    if (_bill.pays.length === 0) {
        balance = _bill.totalValue - amount
    } else {
        let No_pays = _bill.pays.length
        balance = _bill.pays[No_pays - 1].balance - amount
    }
    let pay = new Pay((_bill.pays.length + 1), new Date().toISOString().slice(0, 10), amount, balance, note)
    _bill.pays.push(pay)
        //alert(JSON.stringify(_bill.pays))
        //alert(JSON.stringify(bill))
}

//calcular nuevo saldo si se hace un pago
function calculate_new_balance(billNumber, amount) {
    let my_bill = get_bill(billNumber)
    let No_pays = my_bill.pays.length
    if (No_pays === 0) {
        return my_bill.totalValue - amount
    }
    return (my_bill.pays[No_pays - 1].balance - amount)
}

// obtener saldo
function get_balance(billNumber) {
    let my_bill = get_bill(billNumber)
        //alert(JSON.stringify(my_bill))
    if (my_bill.pays.length === 0) {
        return my_bill.totalValue
    }
    let No_pays = my_bill.pays.length
    return my_bill.pays[No_pays - 1].balance
}

function num_pays(billNumber) {
    let my_bill = get_bill(billNumber)
    return my_bill.pays.length
}

function get_total_pays(billNumber) {
    let my_bill = get_bill(billNumber)
    var pays = my_bill.pays
    var plus_total = 0
    $.each(pays, function(i, _dates) {
        plus_total += _dates.pay
    })
    return plus_total
}
// calcular fecha de vencimiento
function fechaVen(fecha, dias) {
    var date = fecha.getDate()
    fecha.setDate(date + dias)
    fechaGuar = fecha.toISOString().slice(0, 10);

    return fechaGuar;
}

// obtener informacion 
var get_data_set = function(tbody, table) {
    $(tbody).on("click", "button.selec", function() {
        var data = table.row($(this).parents('tr')).data()
            //alert(JSON.stringify(data))
        print_pays_table(data.No_bill)
    })
}

// validar si es de contado la factura
function validateBill(numBill){    
    var output = get_bill(numBill)
    if (output.paymentType==="Contado") {
        return output.totalValue
    }else {
        return null
    }
}

// validar campos vacios

// limiar todo
function clean() {
    $('#saldo').val('')
    $('#abono').val('')
    $('#nuevoSaldo').val('')
    $('#obser').val('')    
    document.getElementById("numeroFac").selectedIndex = "0"
    
}
