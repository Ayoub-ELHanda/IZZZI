locals {
  droplet_name = "${var.project_name}-${var.environment}-app"
  
  common_tags = merge(
    var.common_tags,
    {
      Project     = var.project_name
      ManagedBy   = "terraform"
      Environment = var.environment
      Component   = "application"
    }
  )
  
  cloud_init_config = templatefile("${path.module}/cloud-init.yaml.tpl", {
    ssh_public_key = var.ssh_public_key
  })
}

# Get all SSH keys
data "digitalocean_ssh_keys" "all" {}

# Try to find existing SSH key by name
data "digitalocean_ssh_keys" "existing_by_name" {
  filter {
    key    = "name"
    values = [var.ssh_key_name]
  }
}

locals {
  # Try to find existing key by matching public key content
  matching_key_ids = [
    for key in data.digitalocean_ssh_keys.all.ssh_keys : key.id
    if key.public_key == var.ssh_public_key
  ]
  
  # Use existing key if found by name or public key match
  use_existing_key = length(data.digitalocean_ssh_keys.existing_by_name.ssh_keys) > 0 || length(local.matching_key_ids) > 0
  
  existing_key_id = length(data.digitalocean_ssh_keys.existing_by_name.ssh_keys) > 0 ? data.digitalocean_ssh_keys.existing_by_name.ssh_keys[0].id : (length(local.matching_key_ids) > 0 ? local.matching_key_ids[0] : null)
}

# Create SSH key only if it doesn't exist
resource "digitalocean_ssh_key" "main" {
  count      = local.use_existing_key ? 0 : 1
  name       = var.ssh_key_name
  public_key = var.ssh_public_key
}

locals {
  ssh_key_id = local.use_existing_key ? local.existing_key_id : digitalocean_ssh_key.main[0].id
}

# Application Droplet
resource "digitalocean_droplet" "app" {
  name     = local.droplet_name
  image    = var.droplet_image
  region   = var.region
  size     = var.droplet_size
  vpc_uuid = var.vpc_id
  
  ssh_keys = [local.ssh_key_id]
  
  user_data = local.cloud_init_config
  
  monitoring = var.enable_monitoring
  backups    = var.enable_backups
  ipv6       = var.enable_ipv6
  
  tags = [for k, v in local.common_tags : "${lower(k)}:${lower(v)}"]
  
  lifecycle {
    create_before_destroy = true
    prevent_destroy       = false
    ignore_changes = [
      ssh_keys,
    ]
  }
  
  timeouts {
    create = "10m"
    update = "10m"
    delete = "5m"
  }
}

# Associate droplet with Digital Ocean project (if project_id is provided)
resource "digitalocean_project_resources" "droplet" {
  count   = var.do_project_id != "" ? 1 : 0
  project = var.do_project_id
  resources = [
    digitalocean_droplet.app.urn
  ]
}
