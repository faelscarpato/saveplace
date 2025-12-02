package com.saveplace

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.viewModels
import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import com.saveplace.core.service.GeminiService
import com.saveplace.data.persistence.MockRepository
import com.saveplace.ui.screens.MainScreen
import com.saveplace.ui.viewmodel.MainViewModel

class MainActivity : ComponentActivity() {

    // Cria uma fábrica (Factory) para construir nosso ViewModel manualmente,
    // injetando as dependências que ele precisa.
    private val viewModelFactory = object : ViewModelProvider.Factory {
        override fun <T : ViewModel> create(modelClass: Class<T>): T {
            if (modelClass.isAssignableFrom(MainViewModel::class.java)) {
                // Instancia nossas dependências
                val profileRepo = MockRepository()
                val volunteerRepo = MockRepository()

                // Em um projeto real, a chave NUNCA deve ser hardcoded.
                // Ela seria carregada a partir de um arquivo não versionado, como 'local.properties'.
                // Exemplo:
                // val apiKey = BuildConfig.GEMINI_API_KEY
                val apiKey = "" // Usamos uma string vazia para esta demonstração.

                val geminiService = GeminiService(apiKey)

                // Cria e retorna o ViewModel
                @Suppress("UNCHECKED_CAST")
                return MainViewModel(profileRepo, volunteerRepo, geminiService) as T
            }
            throw IllegalArgumentException("Unknown ViewModel class")
        }
    }

    // Usa a fábrica para obter uma instância do MainViewModel
    private val viewModel: MainViewModel by viewModels { viewModelFactory }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            // Define o conteúdo da atividade para ser o nosso Composable principal,
            // passando o ViewModel para ele.
            MainScreen(viewModel = viewModel)
        }
    }
}
