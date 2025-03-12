from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity

from app import db
from app.models.search import Search
from app.utils.search_engine import SearchEngine

search_bp = Blueprint('search', __name__)

@search_bp.route('/', methods=['POST'])
@jwt_required()
def search():
    """Search for books matching a query."""
    data = request.get_json()
    
    if not data or not data.get('query'):
        return jsonify({'error': 'Missing query parameter'}), 400
    
    user_id = get_jwt_identity()
    query = data['query']
    max_results = data.get('max_results', 50)
    
    search_engine = SearchEngine()
    search, results = search_engine.search(query, user_id, max_results)
    
    return jsonify({
        'search_id': search.id,
        'query': search.query,
        'timestamp': search.timestamp.isoformat(),
        'results': [
            {
                'book': book.to_dict(),
                'relevance': relevance,
                'context': context
            }
            for book, relevance, context in results
        ],
        'count': len(results)
    }), 200


@search_bp.route('/history', methods=['GET'])
@jwt_required()
def get_search_history():
    """Get search history for the current user."""
    user_id = get_jwt_identity()
    limit = request.args.get('limit', 10, type=int)
    
    search_engine = SearchEngine()
    searches = search_engine.get_search_history(user_id, limit)
    
    return jsonify({
        'searches': [search.to_dict() for search in searches],
        'count': len(searches)
    }), 200


@search_bp.route('/history/<int:search_id>', methods=['GET'])
@jwt_required()
def get_search_results(search_id):
    """Get results for a specific search."""
    user_id = get_jwt_identity()
    
    # Check if search belongs to user
    search = Search.query.get(search_id)
    if not search or search.user_id != user_id:
        return jsonify({'error': 'Search not found'}), 404
    
    search_engine = SearchEngine()
    search, results = search_engine.get_search_results(search_id)
    
    return jsonify({
        'search_id': search.id,
        'query': search.query,
        'timestamp': search.timestamp.isoformat(),
        'results': [
            {
                'book': book.to_dict(),
                'relevance': relevance,
                'context': context
            }
            for book, relevance, context in results
        ],
        'count': len(results)
    }), 200


@search_bp.route('/history/<int:search_id>', methods=['DELETE'])
@jwt_required()
def delete_search(search_id):
    """Delete a specific search from history."""
    user_id = get_jwt_identity()
    
    # Check if search belongs to user
    search = Search.query.get(search_id)
    if not search or search.user_id != user_id:
        return jsonify({'error': 'Search not found'}), 404
    
    # Delete search and its results
    db.session.delete(search)
    db.session.commit()
    
    return jsonify({'message': 'Search deleted successfully'}), 200 