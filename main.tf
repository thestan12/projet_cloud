resource "azurerm_resource_group" "project_cloud" {
  name     = "project_cloud"
  location = "francecentral"

  tags {
    Owner = "Souissi Mohamed"
  }
}

resource "azurerm_storage_account" "project_cloud" {
  name                     = "storagecloudx"
  resource_group_name      = "${azurerm_resource_group.project_cloud.name}"
  location                 = "francecentral"
  account_tier             = "Standard"
  account_replication_type = "LRS"
}


resource "azurerm_app_service_plan" "project_cloud" {
    name                = "cloudXAppServicePlan"
    location            = "${azurerm_resource_group.project_cloud.location}"
    resource_group_name = "${azurerm_resource_group.project_cloud.name}"
    sku {
        tier = "Standard"
        size = "S1"
    }
}

resource "azurerm_app_service" "project_cloud" {
    name                = "cloudXAppService"
    location            = "${azurerm_resource_group.project_cloud.location}"
    resource_group_name = "${azurerm_resource_group.project_cloud.name}"
    app_service_plan_id = "${azurerm_app_service_plan.project_cloud.id}"

    app_settings = {
    "WEBSITE_NODE_DEFAULT_VERSION" = "10 LTS"
  }
  connection_string {
    name  = "Database"
    type  = "MySql"
    value = "Server=mysql-server-cloudx.mydomain.com;Integrated Security=SSPI"
  }
}



resource "azurerm_mysql_server" "project_cloud" {
  name                = "mysql-server-cloudx"
  location            = "${azurerm_resource_group.project_cloud.location}"
  resource_group_name = "${azurerm_resource_group.project_cloud.name}"

  sku_name = "B_Gen5_2"

  storage_profile {
    storage_mb            = 5120
    backup_retention_days = 7
    geo_redundant_backup  = "Disabled"
  }

  
  administrator_login          = "esgi_cloud_admin"
  administrator_login_password = "Thebeststanpasswordever95"
  version                      = "5.7"
  ssl_enforcement              = "Disabled"
}

resource "azurerm_mysql_firewall_rule" "project_cloud" {
  name                = "office"
  resource_group_name = "${azurerm_resource_group.project_cloud.name}"
  server_name         = "${azurerm_mysql_server.project_cloud.name}"
  start_ip_address    = "0.0.0.0"
  end_ip_address      = "255.255.255.255"
}

resource "azurerm_mysql_database" "project_cloud" {
  name                = "cloud"
  resource_group_name = "${azurerm_resource_group.project_cloud.name}"
  server_name         = "${azurerm_mysql_server.project_cloud.name}"
  charset             = "utf8"
  collation           = "utf8_unicode_ci"
}

/*

resource "azurerm_sql_server" "project_cloud" {
  name                         = "mysqlservercloudx"
  resource_group_name          = "${azurerm_resource_group.project_cloud.name}"
  location                     = "${azurerm_resource_group.project_cloud.location}"
  version                      = "12.0"
  administrator_login          = "ad007min"
  administrator_login_password = "4-v3ry-53cr37-p455w0rd"
}


resource "azurerm_sql_firewall_rule" "project_cloud" {
  name                = "FirewallRule1"
  resource_group_name = "${azurerm_resource_group.project_cloud.name}"
  server_name         = "${azurerm_sql_server.project_cloud.name}"
  start_ip_address    = "0.0.0.0"
  end_ip_address      = "255.255.255.255"
}


resource "azurerm_sql_database" "project_cloud" {
  name                = "cloud"
  resource_group_name = "${azurerm_resource_group.project_cloud.name}"
  location            = "${azurerm_resource_group.project_cloud.location}"
  server_name         = "${azurerm_sql_server.project_cloud.name}"
  requested_service_objective_name = "S1"

  tags = {
    environment = "production"
  }
}

*/
