const fetchdata = callback => {
    setTimeout(()=>{
       callback('Done!') 
    },1500)   
};

setTimeout(()=>{
    console.log('setTimeout1');
    fetchdata(text=>{
        console.log(text);
    });
},2000)

console.log('Tosin')
console.log('Akindele')