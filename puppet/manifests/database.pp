class triage::database {
  
  class { 'postgresql::globals':
    manage_package_repo => true,
    version             => '9.3',
  } ->
  class { 'postgresql::server': }

  postgresql::server::db { 'triage_prod':
    user     => 'postgres',
    password => postgresql_password('postgres', 'postgres'),
  }

  postgresql::server::role { 'postgres':
    superuser     => true,
    password_hash => postgresql_password('postgres', 'postgres'),
  }

}