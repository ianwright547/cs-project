"""Create users identities sessions and progress"""
from alembic import op
import sqlalchemy as sa


revision = 'deab42f50fd3'
down_revision = None
branch_labels = None
depends_on = None

def upgrade():
    op.create_table('users',
    sa.Column('id', sa.Uuid(), nullable=False),
    sa.Column('display_name', sa.String(length=200), nullable=False),
    sa.Column('email', sa.String(length=320), nullable=True),
    sa.Column('signed_name', sa.String(length=200), nullable=True),
    sa.Column('signed_at', sa.DateTime(timezone=True), nullable=True),
    sa.Column('onboarding_stage', sa.String(length=20), server_default='intro', nullable=False),
    sa.Column('github_skipped', sa.Boolean(), server_default='false', nullable=False),
    sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    sa.CheckConstraint("onboarding_stage IN ('intro', 'signature', 'github', 'complete')", name='valid_onboarding_stage'),
    sa.CheckConstraint('(signed_name IS NULL) = (signed_at IS NULL)', name='signature_timestamp_pair'),
    sa.CheckConstraint('signed_name IS NULL OR length(trim(signed_name)) > 0', name='nonempty_signature'),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('auth_identities',
    sa.Column('id', sa.Uuid(), nullable=False),
    sa.Column('user_id', sa.Uuid(), nullable=False),
    sa.Column('provider', sa.String(length=20), nullable=False),
    sa.Column('provider_subject', sa.String(length=255), nullable=False),
    sa.Column('github_username', sa.String(length=100), nullable=True),
    sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    sa.CheckConstraint("provider IN ('google', 'github')", name='valid_provider'),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('provider', 'provider_subject', name='unique_provider_identity'),
    sa.UniqueConstraint('user_id', 'provider', name='one_identity_per_provider')
    )
    op.create_table('node_progress',
    sa.Column('user_id', sa.Uuid(), nullable=False),
    sa.Column('node_id', sa.String(length=150), nullable=False),
    sa.Column('status', sa.String(length=20), server_default='in_progress', nullable=False),
    sa.Column('last_position', sa.Integer(), server_default='0', nullable=False),
    sa.Column('completed_at', sa.DateTime(timezone=True), nullable=True),
    sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    sa.CheckConstraint("status IN ('in_progress', 'done', 'skipped', 'passed_by_quiz')", name='valid_node_status'),
    sa.CheckConstraint('last_position >= 0', name='nonnegative_position'),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('user_id', 'node_id')
    )
    op.create_table('sessions',
    sa.Column('token_hash', sa.String(length=64), nullable=False),
    sa.Column('user_id', sa.Uuid(), nullable=False),
    sa.Column('expires_at', sa.DateTime(timezone=True), nullable=False),
    sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('token_hash')
    )
    op.create_index(op.f('ix_sessions_expires_at'), 'sessions', ['expires_at'], unique=False)
    op.create_index(op.f('ix_sessions_user_id'), 'sessions', ['user_id'], unique=False)

def downgrade():
    op.drop_index(op.f('ix_sessions_user_id'), table_name='sessions')
    op.drop_index(op.f('ix_sessions_expires_at'), table_name='sessions')
    op.drop_table('sessions')
    op.drop_table('node_progress')
    op.drop_table('auth_identities')
    op.drop_table('users')
