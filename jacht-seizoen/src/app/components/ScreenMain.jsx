const ScreenMain = ({children}) => {
    return ( 
        <main className="mainBackground w-screen h-screen">
            <section className="w-full h-full bg-blue-950/25">
            {children}
            </section>
        </main>
     );
}
 
export default ScreenMain;