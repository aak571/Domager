import react_dom from 'react-dom/client'
import Title from './components/title.jsx'
import MainContent from './components/main_content.jsx'

const MainComponent = () => {
    return (
        <div>
            <Title />
            <MainContent />
        </div>
    )
}

react_dom.createRoot(document.getElementById('rootComponent')).render(<MainComponent />)