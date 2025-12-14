import { observer } from "mobx-react-lite"
import { useStores } from "./hooks/useStores"
import MainLayout from "./layouts/MainLayout"
import AuthView from "./views/AuthView"
import MapView from "./views/MapView"

const App = observer(() => {
  const { authStore } = useStores()

  return (
    <MainLayout>{authStore.isAuth ? <MapView /> : <AuthView />}</MainLayout>
  )
})

export default App
