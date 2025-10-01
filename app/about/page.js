import AboutContent from "../../components/AboutContent";

export const metadata = {
    title: 'About | MovieNest',
    description:
        'MovieNest — արագ, հարմար և գեղագետ հարթակ նոր ֆիլմերի ու սերիալների համար՝ բազմալեզու որոնումով, առանց գրանցման։',
}

export default function AboutPage() {
    return (
        <>
            {/* JSON-LD բլոկը թողնենք այստեղ, եթե պետք է — կարող ես թողնել ինչպես ունեիր */}
            <main className="bg-white/40 dark:bg-black/30">
                <AboutContent />
            </main>
        </>
    )
}
