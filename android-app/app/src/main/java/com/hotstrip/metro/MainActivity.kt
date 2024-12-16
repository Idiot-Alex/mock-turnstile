package com.hotstrip.metro

import android.Manifest
import android.os.Bundle
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.Button
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import com.hotstrip.metro.ui.theme.AndroidappTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MyApp()
        }
    }

    private val requestCameraPermissionLauncher = registerForActivityResult(ActivityResultContracts.RequestPermission()) { isGranted: Boolean ->
        if (isGranted) {
            // 权限被授予
            Toast.makeText(this, "相机权限已授予", Toast.LENGTH_SHORT).show()
        } else {
            // 权限被拒绝
            Toast.makeText(this, "相机权限被拒绝", Toast.LENGTH_SHORT).show()
        }
    }


    @Composable
    fun MyApp() {
        AndroidappTheme {
            // A surface container using the 'background' color from the theme
            Surface(
                modifier = Modifier.fillMaxSize(),
                color = MaterialTheme.colorScheme.background
            ) {
                Main("Android")
            }
        }
    }

    @Composable
    fun Main(name: String, modifier: Modifier = Modifier) {
        Column(
            modifier = modifier // 添加内边距
        ) {
            Text(
                text = "Hello $name!",
                modifier = modifier
            )
            Button(onClick = {
                requestCameraPermissionLauncher.launch(Manifest.permission.CAMERA)
            }) {
                Text(text = "Click Here")
            }
        }
    }

    @Preview(showBackground = true)
    @Composable
    fun DefaultPreview() {
        MyApp()
    }
}

